"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/app/common/LocalStorage";
import { DecryptData, EncryptData } from "@/app/common/HashData";
const secret = process.env.NEXT_PUBLIC_HASH_SECRET as string;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

interface Product {
  id: number;
  name: string;
  title: string;
  price: number;
  slug: string;
  description: string;
  specifications?: string;
  images: string[]; // array of image URLs
  rating?: number;
}

export const ProductPage = ({ slug }: { slug: string }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${appUrl}frontend/products/list/${slug}`);
        const data = await res.json();
        if (data.statusCode === 200) {
          setProduct(data.data);
          setImages(
            data.data.images.map((img: string) => `${appUrl}uploads/${img}`)
          );
          let Dcart: any[] = [];
            const storedCart = getLocalStorageItem("cart"); 

          try {

            if (storedCart) {
              const decrypted = DecryptData(storedCart, secret); 
              Dcart = JSON.parse(decrypted);
            }
          } catch (e) {
            console.error("❌ Failed to load cart:", e);
            Dcart = [];
          }

    

          if (Array.isArray(Dcart) && Dcart.length > 0) {
            const existingItem = Dcart.find(
              (item: any) => item.productId === data.data.id
            );

            if (existingItem) {
              setQuantity(existingItem.quantity);
            }
          }
        } else {
          router.push("/shop");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        router.push("/shop");
      }
    };
    fetchProduct();
  }, [slug, router]);

  const [activeTab, setActiveTab] = useState("description");

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const cartUpdate = (type: "inc" | "dec") => {
    setQuantity((prev) => {
      if (type === "inc" && prev < 10) return prev + 1;
      if (type === "dec" && prev > 1) return prev - 1;
      return prev;
    });
  };

  const cartAdd = () => {
    if (!product) return;

    let cart: any[] = [];

    try {
      const storedCart = getLocalStorageItem("cart");

      if (storedCart) {
        // 🔑 First decrypt the string
        const decrypted = DecryptData(storedCart, secret);

        // 🔍 Then parse the decrypted JSON
        const parsed = JSON.parse(decrypted);

        cart = Array.isArray(parsed) ? parsed : [];

        router.push('/checkout');
      }
    } catch (e) {
      console.error("❌ Failed to load cart:", e);
      cart = [];
    }

    const existingIndex = cart.findIndex(
      (item: any) => item.productId === product.id
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity = quantity;
    } else {
      cart.push({ productId: product.id, quantity, slug: product.slug });
    }
    const encrypted = EncryptData(JSON.stringify(cart), secret);

    setLocalStorageItem("cart", encrypted);
  };

  return (
    <>
      <div className="row">
        {/* LEFT COLUMN - SLIDER */}
        <div className="col-md-6 col-12">
          <Slider {...sliderSettings}>
            {images.map((src, index) => (
              <div key={index}>
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* RIGHT COLUMN - PRODUCT DETAILS */}
        <div className="col-md-6 col-12 product-details">
          <h1 className="product-title">{product ? product.title : ""}</h1>
          <div className="product-price">$ {product ? product.price : 0.0}</div>

          <div className="product-rating">
            ⭐⭐⭐⭐⭐ <span>(0 ratings)</span>
          </div>

          <div className="d-flex align-items-center ">
            <div className="pro-qty">
              <input
                type="text"
                id="quantity"
                name="quantity"
                title="Quantity"
                className="quantity__input product_qty quantity"
                value={quantity}
                readOnly
              />

              <div
                className="dec qty-btn quantity__minus"
                onClick={() => cartUpdate("dec")}>
                -
              </div>

              <div
                className="inc qty-btn quantity__plus"
                onClick={() => cartUpdate("inc")}>
                +
              </div>
            </div>
            <a
              role="button"
              className="info-btn-cart add_tocart btn btn-primary ms-3"
              onClick={cartAdd}>
              Add to cart
            </a>
          </div>

          {/* TABS */}
          <div className="product-tabs">
            <button
              className={activeTab === "description" ? "active" : ""}
              onClick={() => setActiveTab("description")}>
              Description
            </button>
            <button
              className={activeTab === "specifications" ? "active" : ""}
              onClick={() => setActiveTab("specifications")}>
              Specifications
            </button>
            <button
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => setActiveTab("reviews")}>
              Reviews
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="product-tab-content">
            {activeTab === "description" &&
              (product && product.description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p>No description available</p>
              ))}

            {activeTab === "specifications" &&
              (product && product.specifications ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.specifications }}
                />
              ) : (
                <p>No specifications available</p>
              ))}

            {activeTab === "reviews" && (
              <div>
                <p>No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
