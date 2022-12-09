import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';

import TokenField from '../../components/TokenField';
import { AppLayout } from '../../components/Layout/AppLayout';
import Button from '../../components/Button';
import { Slider } from '../../components/Slider';
import Header from '../BorrowPage/components/Header';
import { useBorrowPage } from '../BorrowPage';
import { riskMarks, durationMarks } from './hooks/usePoolCreation';
import OrderBook from '../BondPage/components/OrderBook/OrderBook';
import { SOL_TOKEN } from '../../utils';
import styles from './PoolsCreationPage.module.scss';

const PoolsCreationPage: FC = () => {
  const history = useHistory();
  const [tokenValue, setTokenValue] = useState('0');
  const [risk, setRisk] = useState(1);
  const {
    bulks,
    borrowValue,
    loading,
    availableBorrowValue,
    onSubmit,
    onBorrowPercentChange,
    percentValue,
    onBorrowValueChange,
    notEnoughBalanceError,
  } = useBorrowPage();

  const width = document.body.clientWidth;

  const goBack = () => {
    history.goBack();
  };
  return (
    <AppLayout>
      <div className={styles.poolsCreation}>
        <Header title="Pools creation" onClick={goBack} />

        <div className={styles.block}>
          <div className={styles.wrapper}>
            <div className={styles.col}>
              <h5 className={styles.blockTitle}>Parameters</h5>
              <Slider
                value={risk}
                setValue={setRisk}
                className={styles.slider}
                marks={riskMarks}
                label="RISK"
                step={50}
                min={0}
                max={100}
              />
              <Slider
                value={percentValue}
                setValue={onBorrowPercentChange}
                className={styles.slider}
                marks={durationMarks}
                label="DURATION"
                step={33}
                min={0}
                max={100}
              />
              <h5 className={styles.blockTitle}>Pricing</h5>
              <TokenField
                value={tokenValue}
                onValueChange={(e: any) => setTokenValue(e)}
                label="START FEE"
                currentToken={SOL_TOKEN}
                tokensList={[SOL_TOKEN, SOL_TOKEN]}
                toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
              />
            </div>
            <div className={styles.col}>
              <h5 className={styles.blockTitle}>Assets</h5>

              <TokenField
                value={tokenValue}
                onValueChange={(e: any) => setTokenValue(e)}
                label="ORDER SIZE"
                currentToken={SOL_TOKEN}
                onUseMaxButtonClick={() => {}}
              />
            </div>
          </div>
          <Button
            // disabled={!borrowValue}
            className={styles.btn}
            type="secondary"
          >
            {'Create pool'}
          </Button>
        </div>
      </div>
      {width > 767 ? <OrderBook /> : null}
    </AppLayout>
  );
};

export default PoolsCreationPage;
