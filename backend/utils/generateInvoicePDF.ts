import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

export const generateInvoicePDF = (data: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    // REQUIRED FIX HERE ↓↓↓
    const doc = new PDFDocument({ bufferPages: true });

    const stream = new PassThrough();
    const chunks: any[] = [];

    doc.pipe(stream);

    doc.fontSize(20).text("Microchip Payment Invoice", { underline: true });
    doc.moveDown();

    doc.fontSize(12).text(`Order ID: ${data.orderId}`);
    doc.text(`Microchip Number: ${data.microchipId}`);
    doc.text(`Package: ${data.packageType}`);
    doc.text(`Payment Method: ${data.paymentType}`);
    doc.text(`Amount Paid: £${data.amount}`);
    doc.text(`Date: ${data.date}`);
    doc.moveDown();
    doc.text(`Customer Name: ${data.customerName}`);
    doc.text(`Email: ${data.customerEmail}`);

    doc.end();

    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};
