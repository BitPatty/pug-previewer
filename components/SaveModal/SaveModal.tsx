import { useState } from 'react';

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
  const [gen, setGen] = useState<number>(0);
  const saves = SaveHandler.loadSaves();

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <div key={gen}>
            {Object.keys(saves).length === 0 && 'No Saves found'}
            {Object.entries(saves).map((e) => (
              <div
                className="is-flex is-justify-content-space-between is-align-items-center	 mt-4"
                key={e[0]}
              >
                <div>{e[0]}</div>
                <div>
                  <Button
                    label="Restore"
                    theme="link"
                    onClick={() => onRestore(e[1])}
                  />{' '}
                  <Button
                    iconClass="fa-trash"
                    theme="danger"
                    onClick={() => {
                      SaveHandler.deleteSave(e[0]);
                      setGen((g) => g + 1);
                    }}
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
