export function Summary({ text }: { text: string }) {
  return (
    <section className="summary-section">
      <div className="summary-header">
        <span className="summary-tag">Summary</span>
        <span className="summary-note">AI-generated</span>
      </div>
      <p className="summary-text">{text}</p>
    </section>
  );
}
