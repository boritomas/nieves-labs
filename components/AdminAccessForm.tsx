export default function AdminAccessForm({ title = 'Admin Access' }: { title?: string }) {
  return (
    <section className="admin-access panel">
      <p className="eyebrow">Protected area</p>
      <h1>{title}</h1>
      <p>Enter your admin token to continue.</p>
      <form className="checkout-form" method="get">
        <label>
          Admin token
          <input name="token" type="password" autoComplete="current-password" required />
        </label>
        <button className="button-primary" type="submit">Continue</button>
      </form>
    </section>
  );
}
