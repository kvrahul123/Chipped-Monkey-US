import { Body, Controller, Post, Route, Tags } from "tsoa";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities/Contact";
import { MicrochipPayment } from "../../entities/MicrochipPayment";
import { MicrochipPaymentDetails } from "../../entities/MicrochipPaymentDetails";
import { Order } from "../../entities/Order";
import { PackageDetails } from "../../entities/PackageDetails";
import { Subscription } from "../../entities/Subscription";

const AuthorizeNet = require("authorizenet");
const ApiContracts = AuthorizeNet.APIContracts;
const ApiControllers = AuthorizeNet.APIControllers;
const SDKConstants = require("authorizenet/lib/constants");

@Route("payment")
@Tags("Payment")
export class PaymentController extends Controller {
  @Post("get-token")
  public async getPaymentToken(
    @Body()
    data: {
      microchip_id: string;
      amount: number;
      userId?: number;
      vendor_tx_code?: string;
      paymentPage?: string;
    }
  ): Promise<any> {
    const { microchip_id, amount, userId, vendor_tx_code, paymentPage } = data;

    const userRepository = AppDataSource.getRepository(User);

    const userDetails = await userRepository.findOne({ where: { id: userId } });
    /** AUTH */
    const merchantAuthentication =
      new ApiContracts.MerchantAuthenticationType();
    merchantAuthentication.setName(process.env.AUTHORIZE_NET_LOGIN_ID);
    merchantAuthentication.setTransactionKey(
      process.env.AUTHORIZE_NET_TRANSACTION_KEY
    );

    /** TRANSACTION */
    const transactionRequest = new ApiContracts.TransactionRequestType();
    transactionRequest.setTransactionType(
      ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
    );
    transactionRequest.setAmount(amount);

    /** CUSTOMER */
    const customer = new ApiContracts.CustomerDataType();
    customer.setEmail(userDetails ? userDetails.email : "");
    transactionRequest.setCustomer(customer);

    /** BILL TO */
    const billTo = new ApiContracts.CustomerAddressType();
    billTo.setFirstName(userDetails ? userDetails.name : null);
    billTo.setLastName("");
    billTo.setCompany("");
    const fullAddress = userDetails
      ? `${userDetails.address_1 || ""} ${userDetails.address_2 || ""} ${
          userDetails.address_3 || ""
        }`
      : "";

    billTo.setAddress(fullAddress.replace(/\n/g, " ").substring(0, 60));
    billTo.setCity(userDetails ? userDetails.city : "");
    billTo.setState(userDetails ? userDetails.county : "");
    billTo.setZip(userDetails ? userDetails.postcode : "");
    billTo.setCountry(userDetails ? userDetails.country : "");
    transactionRequest.setBillTo(billTo);

    /** SETTINGS ARRAY (CRITICAL) */
    const settings: any[] = [];

    const addSetting = (name: string, value: any) => {
      const s = new ApiContracts.SettingType();
      s.setSettingName(name);
      s.setSettingValue(JSON.stringify(value));
      settings.push(s);
    };

    // addSetting("hostedPaymentReturnOptions", {
    //   showReceipt: true,
    //   url: `${process.env.FRONTEND_URL}payment/success?token=${vendor_tx_code}`,
    //   urlText: "Continue",
    //   cancelUrl: `${process.env.FRONTEND_URL}payment/cancel?token=${vendor_tx_code}`,
    //   cancelUrlText: "Cancel",
    // });

    addSetting("hostedPaymentReturnOptions", {
      showReceipt: true,
      url: `${process.env.FRONTEND_URL}customer/dashboard`,
      urlText: "Continue",
      cancelUrl: `${process.env.FRONTEND_URL}payment/cancel?token=${vendor_tx_code}`,
      cancelUrlText: "Cancel",
    });

    addSetting("hostedPaymentButtonOptions", { text: "Pay" });

    addSetting("hostedPaymentStyleOptions", { bgColor: "blue" });

    addSetting("hostedPaymentPaymentOptions", {
      cardCodeRequired: false,
      showCreditCard: true,
      showBankAccount: true,
    });

    addSetting("hostedPaymentSecurityOptions", { captcha: false });

    addSetting("hostedPaymentShippingAddressOptions", {
      show: false,
      required: false,
    });

    addSetting("hostedPaymentBillingAddressOptions", {
      show: true,
      required: false,
    });

    addSetting("hostedPaymentCustomerOptions", {
      showEmail: false,
      requiredEmail: false,
      addPaymentProfile: true,
    });

    addSetting("hostedPaymentOrderOptions", {
      show: true,
      merchantName: "Chipped Monkey",
    });

    addSetting("hostedPaymentIFrameCommunicatorUrl", {
      url: `${process.env.FRONTEND_URL}special`,
    });

    const settingList = new ApiContracts.ArrayOfSetting();
    settingList.setSetting(settings);

    /** REQUEST */
    const request = new ApiContracts.GetHostedPaymentPageRequest();
    request.setMerchantAuthentication(merchantAuthentication);
    request.setTransactionRequest(transactionRequest);
    request.setHostedPaymentSettings(settingList);
    /** ORDER (THIS IS WHAT WEBHOOK READS) */
    const order = new ApiContracts.OrderType();

    /**
     * invoiceNumber rules:
     * - string
     * - max 20 chars
     */
    order.setInvoiceNumber(vendor_tx_code);
    console.log("vendor_tx_code::" + vendor_tx_code);
    order.setDescription("Microchip payment");

    transactionRequest.setOrder(order);

    /** CONTROLLER */
    const ctrl = new ApiControllers.GetHostedPaymentPageController(
      request.getJSON()
    );

    ctrl.setEnvironment(
      process.env.AUTHORIZE_NET_ENV === "production"
        ? "https://api.authorize.net/xml/v1/request.api"
        : "https://apitest.authorize.net/xml/v1/request.api"
    );

    return new Promise((resolve, reject) => {
      ctrl.execute(() => {
        const apiResponse = ctrl.getResponse();

        if (!apiResponse) {
          return reject("Null response from Authorize.Net");
        }

        const response = new ApiContracts.GetHostedPaymentPageResponse(
          apiResponse
        );

        if (
          response.getMessages().getResultCode() ===
          ApiContracts.MessageTypeEnum.OK
        ) {
          resolve({
            token: response.getToken(),
            messages: response.getMessages(),
          });
        } else {
          reject(response.getMessages().getMessage());
        }
      });
    });
  }

  @Post("webhook")
  public async authorizeNetWebhook(@Body() payload: any): Promise<any> {
    try {
      if (payload.eventType !== "net.authorize.payment.authcapture.created") {
        return { status: "ignored" };
      }

      const transaction = payload.payload;

      console.log("🔔 Authorize.Net Webhook Received");
      console.log("📦 Full Payload:", JSON.stringify(payload, null, 2));

      const transactionId = transaction.id;
      const amount =
        transaction?.authAmount ?? transaction?.settleAmount ?? null;
      const invoice = transaction.invoiceNumber;

      console.log("💳 Transaction Summary:", {
        transactionId,
        amount,
        invoice,
      });

      const contactRepo = AppDataSource.getRepository(Contact);
      const paymentRepo = AppDataSource.getRepository(MicrochipPayment);
      const paymentDetailsRepo = AppDataSource.getRepository(
        MicrochipPaymentDetails
      );
      const orderRepo = AppDataSource.getRepository(Order);

      /** 🔍 1️⃣ CHECK MICROCHIP ORDER FIRST */
      const microchip = await contactRepo.findOne({
        where: { vendorTxCode: invoice },
      });

      if (microchip) {
        console.log("🛍️ microchip order payment detected");

        microchip.payment_status = "paid";
        microchip.status = "active";
        await contactRepo.save(microchip);

        const payment = await paymentRepo.findOne({
          where: { order_id: invoice },
        });

        if (payment) {
          payment.payment_status = "paid";
          payment.payment_response = JSON.stringify(transaction);
          await paymentRepo.save(payment);

          await paymentDetailsRepo.update(
            { microchip_order_id: payment.id },
            { status: "paid" }
          );
        }

        return { status: "ok", type: "microchip" };
      }

      /** 🛒 2️⃣ CHECK PRODUCT CHECKOUT ORDER */
      const order = await orderRepo.findOne({
        where: { vendorTxCode: invoice },
      });

      if (order) {
        console.log("🛍️ Checkout order payment detected");

        order.payment_status = "paid";
        await orderRepo.save(order);

        return { status: "ok", type: "checkout" };
      }

      console.log("🛍️ nothing detected");

      return { status: "not_found" };
    } catch (err) {
      console.error("❌ Webhook error:", err);
      return { status: "error" };
    }
  }




 
}
