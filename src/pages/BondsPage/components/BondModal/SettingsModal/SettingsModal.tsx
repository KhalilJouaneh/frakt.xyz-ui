import { FC, useEffect, useRef, useState } from 'react';
import cx from 'classnames';

import NumericInput from '../../../../../components/NumericInput';
import { useOnClickOutside } from '../../../../../utils';
import Button from '../../../../../components/Button';
import styles from './SettingsModal.module.scss';
import Icons from '../../../../../iconsNew';

interface SettingsModalProps {
  slippage: string;
  setSlippage: (nextSlippage: string) => void;
}

const SettingsModal: FC<SettingsModalProps> = ({ slippage, setSlippage }) => {
  const [invalidSlippageError, setInvalidSlippageError] = useState<string>('');
  const [mayFailError, setMayFailError] = useState<string>('');

  const [slippageModalVisible, setSlippageModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      isNaN(Number(slippage)) ||
      Number(slippage) <= 0 ||
      Number(slippage) > 100
    ) {
      setInvalidSlippageError('Please enter a valid slippage percentage');
    } else {
      setInvalidSlippageError('');
    }
  }, [slippage]);

  useEffect(() => {
    if (Number(slippage) < 1) {
      setMayFailError('Your transaction may fail');
    } else {
      setMayFailError('');
    }
  }, [slippage]);

  const ref = useRef();
  useOnClickOutside(ref, () => {
    if (invalidSlippageError) {
      setSlippage('1');
    }
    setSlippageModalVisible(false);
  });

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <div
        className={styles.settings}
        onClick={() => setSlippageModalVisible(!slippageModalVisible)}
      >
        <Icons.Settings />
        <p>Slippage settings</p>
      </div>
      {slippageModalVisible && (
        <div className={styles.modal}>
          <div className={styles.slippage}>
            <div className={styles.slippageInputs}>
              <Button
                type="tertiary"
                className={cx([
                  styles.btn,
                  slippage === '0.1' && styles.btnActive,
                ])}
                onClick={() => setSlippage('0.1')}
              >
                0.1%
              </Button>
              <Button
                type="tertiary"
                className={cx([
                  styles.btn,
                  slippage === '0.5' && styles.btnActive,
                ])}
                onClick={() => setSlippage('0.5')}
              >
                0.5%
              </Button>
              <Button
                type="tertiary"
                className={cx([
                  styles.btn,
                  slippage === '1' && styles.btnActive,
                ])}
                onClick={() => setSlippage('1')}
              >
                1%
              </Button>
            </div>
            <div className={styles.inputWrapper}>
              <NumericInput
                className={styles.input}
                value={slippage}
                onChange={setSlippage}
                error={!!invalidSlippageError}
                positiveOnly
              />
            </div>
            {(mayFailError || invalidSlippageError) && (
              <div className={styles.slippageErrors}>
                {mayFailError && <p>{mayFailError}</p>}
                {invalidSlippageError && <p>{invalidSlippageError}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsModal;
