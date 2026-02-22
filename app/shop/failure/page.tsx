export default function FailurePage() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#1a1a1a",
      color: "red",
      flexDirection: "column"
    }}>
      <h1>❌ Pagamento não aprovado</h1>
      <a href="/shop" style={{ marginTop: 20 }}>
        Tentar novamente
      </a>
    </div>
  );
}