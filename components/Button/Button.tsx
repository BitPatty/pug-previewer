import { useMemo } from 'react';

type RequiredProps = {
  label: string;
  onClick: () => void | Promise<void>;
};

type OptionalProps = {
  disabled?: boolean;
  isLoading?: boolean;
  iconClass?: string;
  theme?: 'primary' | 'link' | 'info' | 'success' | 'warning';
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
    [isLoading],
  );

  return (
    <button disabled={disabled} className={classes} onClick={() => onClick()}>
      {iconClass && (
        <span className="icon">
          <i className={`fas ${iconClass}`}></i>
        </span>
      )}
      <span>{label}</span>
    </button>
  );
};

export default Button;
