function FooterC({ onReset }) {
  return (
    <footer className="footer">
      <p>ComplaintCare (c) 2026</p>
      <button className="text-button" type="button" onClick={onReset}>
        Reset Demo Data
      </button>
    </footer>
  );
}

export default FooterC;
