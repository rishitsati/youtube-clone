import { Link } from "react-router-dom";

function Header() {
  return (
    <div style={styles.header}>
      <div style={styles.left}>
        <span style={styles.menu}>☰</span>
        <h2 style={styles.logo}>YouTube</h2>
      </div>

      <div style={styles.center}>
        <input
          type="text"
          placeholder="Search"
          style={styles.search}
        />
        <button style={styles.searchBtn}>🔍</button>
      </div>

      <div style={styles.right}>
        <Link to="/login">
          <button style={styles.signIn}>Sign In</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    borderBottom: "1px solid #ddd",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  menu: {
    fontSize: "22px",
    cursor: "pointer",
  },
  logo: {
    color: "red",
  },
  center: {
    display: "flex",
    width: "50%",
  },
  search: {
    flex: 1,
    padding: "8px",
  },
  searchBtn: {
    padding: "8px 15px",
  },
  right: {},
  signIn: {
    padding: "8px 12px",
    cursor: "pointer",
  },
};

export default Header;
