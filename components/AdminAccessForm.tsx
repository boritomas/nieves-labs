export default function AdminAccessForm({
  title = 'Admin Access',
  invalid = false,
}: {
  title?: string;
  invalid?: boolean;
}) {
  return (
    <section className="admin-access panel">
      <p className="eyebrow">Protected area</p>
      <h1>{title}</h1>
      <p>Enter the private token value configured for this production site.</p>
      {invalid ? (
        <p role="alert" style={{ color: '#fca5a5', fontWeight: 700 }}>
          Access denied. The submitted token does not match the current production token.
        </p>
      ) : null}
      <form className="checkout-form" method="get">
        <label>
          Admin token
          <input
            name="token"
            type="password"
            autoComplete="off"
            spellCheck={false}
            required
          />
        </label>
        <button className="button-primary" type="submit">Continue</button>
      </form>
    </section>
  );
}
