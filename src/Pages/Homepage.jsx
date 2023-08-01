import PageNav from "../UI/PageNav";
import { useEffect, useState } from "react";
import styles from "./Homepage.module.css";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const sendContactForm = async (formData) => {
  try {
    const response = await fetch("http://localhost:3000/request/send", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Error sending contact form");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error sending contact form");
  }
};

export default function ScrollHaandler() {
  const [activeLink, setActiveLink] = useState("");
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState(""); // State to keep track of the active link
  const mutation = useMutation(sendContactForm, {
    onSuccess: () => {
      toast.success("Message Sent");
      setname("");
      setEmail("");
      setMessage("");
      setNumber("");
    },
    onError: (error) => {
      console.log(error);
      // toast.error(error);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name,
      email,
      message,
      mobileNumber: number,
    };

    // Call the mutation function to send the data to the backend
    mutation.mutate(formData);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll position
      const scrollPosition = window.scrollY;

      // Determine active link based on scroll position
      // You can use specific offsets or logic based on your page structure
      if (scrollPosition < 500) {
        setActiveLink("home");
      } else if (scrollPosition >= 500 && scrollPosition < 1000) {
        setActiveLink("AboutUs");
      } else if (scrollPosition >= 1200 && scrollPosition < 1700) {
        setActiveLink("Collabaration");
      } else if (scrollPosition >= 2000 && scrollPosition < 2500) {
        setActiveLink("ContactUs");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <div className={`${window.scrollY > 50 ? styles.pagenav : ""}`}>
        <PageNav
          activeLink={activeLink}
          scrollToSection={scrollToSection}
        ></PageNav>
      </div>
      <anchor id="home">
        <section className={styles.section}>
          <div className={styles.text}>EPIC MUSIC EXPERIENCE</div>
          <div style={{ fontFamily: "sans-serif", marginBottom: "20px" }}>
            We have the perfect copywrite-free music around the world and
            discover them now
          </div>
          <div className={styles.login}>
            <button
              to="#AboutUs"
              className={styles.logbtn}
              onClick={() => scrollToSection("AboutUs")}
            >
              About Us
            </button>
          </div>
        </section>
      </anchor>
      <div className={styles.gradient_div}>
        <span className={styles.divText}>
          Copywrite-Free Music in your hand
        </span>
        <span className={styles.divText2}>
          Unleash your creativity with our versatile music downloads ,perfect
          for any project you have in our mind
        </span>
      </div>
      <anchor id="Collabaration"></anchor>
      <section className={styles.col}>
        <div className={styles.text} style={{ fontSize: "4rem" }}>
          OUR COLLABORATION
        </div>
        <div className={styles.collab_div}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <img
              style={{ height: "300px", width: "300px" }}
              src="/AmisiErio.jpeg"
              alt="AmisiErio"
            ></img>
            <h1 style={{ paddingTop: "10px", fontSize: "2rem" }}>AMISI ERIO</h1>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <img
              style={{ height: "300px", width: "300px" }}
              src="/TwinKings.jpeg"
              alt="TWIN KING"
            ></img>
            <h1 style={{ paddingTop: "10px", fontSize: "2rem" }}>TWIN KINGS</h1>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <img
              style={{ height: "300px", width: "300px" }}
              src="/Power.jpeg"
              alt="Power"
            ></img>
            <h1 style={{ paddingTop: "10px", fontSize: "2rem" }}>
              POWER MUSIC EMPIRE
            </h1>
          </div>
        </div>
      </section>
      <anchor id="AboutUs"></anchor>
      <section className={styles.aboutsection}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className={styles.text2}>ABOUT US</div>
          <div
            style={{
              fontFamily: "sans-serif",
              marginBottom: "20px",
              fontSize: "22px",
              fontWeight: "100px",
              marginTop: "20px",
              textAlign: "justify",
              width: "60%",
            }}
          >
            At The Pine Tree Media & Entertainment, we specialize in providing
            exclusive, copyright-free music solutions tailored to elevate the
            ambiance and enhance the overall experience of your business. As a
            leading provider of music services, we understand the vital role
            music plays in setting the right mood and atmosphere for various
            establishments like Bars, Discotheques, Shops, Hotels, Restaurants.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "sans-serif",
              marginBottom: "20px",
              fontSize: "22px",
              fontWeight: "100px",
              marginTop: "20px",
              textAlign: "justify",
              paddingRight: "30px",
              width: "50%",
            }}
          >
            We believe that every business deserves a unique and unforgettable
            musical experience for its patrons. Our vast and diverse library
            boasts a wide array of genres, including international music, to
            cater to the diverse preferences of your clientele. Whether you seek
            energetic tunes to enliven the space or soothing melodies to create
            a relaxing Unforgettable Experiences through Music.
          </div>
          <div className={styles.text3}>
            Crafting Unforgettable Experiences through Music
          </div>
        </div>
      </section>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className={styles.text4}>WHY CHOOSE US </div>
        <div className={styles.whyChoose1}>
          <span className={styles.text5}>1. Copyright-Free Music</span>
          <div
            style={{
              fontFamily: "sans-serif",
              marginBottom: "20px",
              fontSize: "22px",
              fontWeight: "100px",
              color: "white",
              textAlign: "justify",
              margin: "10px 5px",
              width: "50%",
            }}
          >
            Your peace of mind is essential to us.That&apos;s why our music
            collection is carefully curated to be completely free from any
            copyright restrictions. With us, you can say goodbye to legal
            challenges and costly licensing fees.
          </div>
        </div>
        <div className={styles.whyChoose1}>
          <span
            style={{
              fontFamily: "sans-serif",
              marginBottom: "20px",
              fontSize: "22px",
              fontWeight: "100px",
              color: "white",
              paddingLeft: "20px",
              margin: "10px 5px",
              textAlign: "justify",
              width: "50%",
            }}
          >
            Our expertly curated library covers a rich tapestry of musical
            styles, ensuring that y find the right music for any occasion. We
            understand that every establishment is unique, and our diverse
            collection reflects just that.
          </span>
          <span className={styles.text6}>
            2.Varied Genres for Every Occasion
          </span>
        </div>
        <div className={styles.whyChoose1}>
          <span className={styles.text7}>3. Seamless Integration</span>
          <span
            style={{
              fontFamily: "sans-serif",
              marginBottom: "20px",
              fontSize: "22px",
              fontWeight: "100px",
              paddingRight: "30px",
              color: "white",
              margin: "10px 5px",
              textAlign: "justify",
              width: "50%",
            }}
          >
            We understand that you have a business to run, and we want to make
            the process of integrating our music solution as smooth as possible.
            Our dedicated team of experts will work closely with you to
            seamlessly integrate our music into your establishment.
          </span>
        </div>
        <div className={styles.whyChoose1}>
          <div className={styles.whyChoose1}>
            <span
              style={{
                fontFamily: "sans-serif",
                marginBottom: "20px",
                fontSize: "22px",
                fontWeight: "100px",
                color: "white",
                paddingLeft: "20px",
                margin: "10px 5px",
                textAlign: "justify",
                width: "50%",
              }}
            >
              Our expertly curated library covers a rich tapestry of musical
              styles, ensuring that y find the right music for any occasion. We
              understand that every establishment is unique, and our diverse
              collection reflects just that.
            </span>
            <span className={styles.text8}>
              4.Economical and Quality Focused
            </span>
          </div>
        </div>
      </div>
      <anchor id="ContactUs">
        <section className={styles.collaborate}>
          <div className={styles.glassmorphism_div}>
            <span className={styles.formHeader}>Contact Us</span>
            <span className={styles.formContent}>
              Tell us anything you want to say to us. We welcome your
              feedback.😉
            </span>
            <form onSubmit={handleSubmit} className={styles.inputs}>
              <input
                className={styles.data}
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
              />
              <input
                className={styles.data}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className={styles.data}
                type="number"
                placeholder="Mobile Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
              <textarea
                className={styles.data}
                placeholder="Tell us Something"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                style={{
                  height: "90px",
                  width: "100%",
                  padding: "10px 10px",
                  fontSize: "16px",
                }}
              />

              <button type="submit" className={styles.btn}>
                Send message
              </button>
            </form>
          </div>
        </section>
      </anchor>
      <footer className={styles.footer}>
        <div className={styles.company}>
          <div className={styles.comp}>
            <img src="/Logo.png" alt="WorldWise logo" className={styles.logo} />
            <div className={styles.mainHead}>
              <span className={styles.main1}>The Pine Tree </span>
              <span className={styles.main2}>Media and Entertainment </span>
            </div>
          </div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "400",
              fontFamily: "Roboto",
              textAlign: "justify",
              width: "290px",
            }}
          >
            At The Pine Tree Media & Entertainment, we offer copyright-free
            music solutions for businesses like Bars, Shops, Hotels, and more.
          </div>
        </div>
        <div className={styles.Social}>
          <span>Social Media</span>
          <span>For recent updates and news follow our social media feeds</span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              width: "50%",
            }}
          >
            <FaLinkedin></FaLinkedin>
            <FaInstagram></FaInstagram>
            <FaFacebook></FaFacebook>
            <FaTwitter></FaTwitter>
          </div>
        </div>
      </footer>
    </div>
  );
}
