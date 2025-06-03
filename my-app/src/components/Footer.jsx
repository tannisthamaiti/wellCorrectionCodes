export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Copyright © {currentYear} Earthscan. All rights reserved.</p>
      </div>
    </footer>
  );
}
