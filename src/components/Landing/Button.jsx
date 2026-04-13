const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick} style={styles.button}>
      {text}
    </button>
  );
};

const styles = {
  button: {
    padding: "10px 15px",
    backgroundColor: "#004aad",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default Button;