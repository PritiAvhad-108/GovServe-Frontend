const Input = ({ type = "text", placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={styles.input}
    />
  );
};

const styles = {
  input: {
    padding: "8px",
    marginBottom: "10px",
    width: "100%",
    boxSizing: "border-box"
  }
};

export default Input;