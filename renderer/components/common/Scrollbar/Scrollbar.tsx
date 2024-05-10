import styles from './Scrollbar.module.css';

const Scrollbar = ({ children, style = {}, ...rest }) => {
  return (
    <div className={styles.scrollbar} style={{ ...style }} {...rest}>
      {children}
    </div>
  );
};

export default Scrollbar;