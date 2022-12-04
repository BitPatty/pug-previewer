import { Save, SaveHandler } from '../../utils';
import Button from '../Button';

type RequiredProps = {
  onClose: () => void;
  onRestore: (save: Save) => void;
};

type OptionalProps = {
  //
};

const SaveModal: React.FC<RequiredProps & OptionalProps> = ({
  onClose,
  onRestore,
}) => {
  const saves = SaveHandler.loadSaves();

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <div>
            {Object.entries(saves).map((e) => (
              <div className="columns is-vcentered m-1" key={e[0]}>
                <div className="column">{e[0]}</div>
                <div className="column has-text-right">
                  <Button
                    label="Restore"
                    theme="link"
                    onClick={() => onRestore(e[1])}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => onClose()}
        className="modal-close is-large"
        aria-label="close"
      />
    </div>
  );
};

export default SaveModal;
