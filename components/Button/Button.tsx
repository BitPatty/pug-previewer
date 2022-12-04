import { useMemo } from 'react';

type RequiredProps = {
  onClick: () => void | Promise<void>;
};

type OptionalProps = {
  disabled?: boolean;
  label?: string;
  isLoading?: boolean;
  iconClass?: string;
  theme?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger';
};

const Button: React.FC<RequiredProps & OptionalProps> = ({
  label,
  onClick,
  disabled,
  isLoading,
  iconClass,
  theme,
}) => {
  const classes = useMemo(
    () =>
      Object.entries({
        button: true,
        'is-loading': isLoading,
        [`is-${theme}`]: theme != null,
      }).reduce((p, n) => `${p} ${n[1] ? n[0] : ''}`, ''),
    [isLoading, theme],
  );

  return (
    <button disabled={disabled} className={classes} onClick={() => onClick()}>
      {iconClass && (
        <span className="icon">
          <i className={`fas ${iconClass}`}></i>
        </span>
      )}
      {label && <span>{label}</span>}
    </button>
  );
};

export default Button;
