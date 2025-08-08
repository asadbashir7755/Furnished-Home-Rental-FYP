import React from "react";
import { Layout, Row, Col } from "antd";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const { Footer } = Layout;

const CustomFooter = () => {
  return (
    <Footer style={styles.footer}>
      <Row>
        <Col xs={24} md={8} style={styles.col}>
          <h5>About Us</h5>
          <p>
            We provide high-quality heavy equipment for various industries. Our mission is to deliver excellence through our products and services.
          </p>
        </Col>
        <Col xs={24} md={8} style={styles.col}>
          <h5>Follow Us</h5>
          <div style={styles.socialIcons}>
            <a href="#" style={styles.link}><FaFacebook size={24} /></a>
            <a href="#" style={styles.link}><FaTwitter size={24} /></a>
            <a href="#" style={styles.link}><FaInstagram size={24} /></a>
            <a href="#" style={styles.link}><FaLinkedin size={24} /></a>
          </div>
        </Col>
        <Col xs={24} md={8} style={styles.col}>
          <h5>Contact Us</h5>
          <p>Email: asadbashir2229526@gmail.com</p>
          <p>Phone: +923400569133</p>
        </Col>
      </Row>
      <Row style={styles.footerBottom}>
        <Col span={24} style={styles.textCenter}>
          <p>© 2025 FurnsishedHomeRental. All Rights Reserved.</p>
        </Col>
      </Row>
    </Footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#001529",
    color: "#fff",
    padding: "20px 50px",
  },
  col: {
    textAlign: "center",
    marginBottom: "20px",
  },
  socialIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  link: {
    color: "#fff",
    transition: "color 0.3s",
  },
  linkHover: {
    color: "pink",
  },
  footerBottom: {
    marginTop: "20px",
  },
  textCenter: {
    textAlign: "center",
  },
};

export default CustomFooter;
