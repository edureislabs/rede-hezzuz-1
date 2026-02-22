export default function SuccessPage() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      color: "white",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "3rem" }}>🎉 Pagamento Aprovado!</h1>
      <p style={{ marginTop: "20px", fontSize: "1.2rem" }}>
        Seu VIP/Cash será entregue automaticamente no servidor.
      </p>
      <a href="/shop" style={{
        marginTop: "30px",
        padding: "10px 20px",
        backgroundColor: "#00ff99",
        borderRadius: "8px",
        textDecoration: "none",
        color: "black",
        fontWeight: "bold"
      }}>
        Voltar para Loja
      </a>
    </div>
  );
}