import { FC, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import TokenField from '../../components/TokenField';
import { AppLayout } from '../../components/Layout/AppLayout';
import Button from '../../components/Button';
import { Slider } from '../../components/Slider';
import Header from '../BorrowPage/components/Header';
import { useBorrowPage } from '../BorrowPage';
import { riskMarks, durationMarks } from './hooks/usePoolCreation';
import OrderBook from '../MarketPage/components/OrderBook/OrderBook';
import { SOL_TOKEN } from '../../utils';
import styles from './PoolsCreationPage.module.scss';
// import { TokenAmountInput } from '@frakt/components/TokenAmountInput';
// import { makeCreatePairTransaction } from '@frakt/utils/bonds';
// import { signAndConfirmTransaction } from '@frakt/utils/transactions';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { web3 } from 'fbonds-core';

const PoolsCreationPage: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();

  const history = useHistory();
  const [tokenValue, setTokenValue] = useState('0');
  const [risk, setRisk] = useState(1);
  const {
    onBorrowPercentChange,
    percentValue,
    // bulks,
    // borrowValue,
    // loading,
    // availableBorrowValue,
    // onSubmit,
    // onBorrowValueChange,
    // notEnoughBalanceError,
  } = useBorrowPage();

  //TODO: Bind with form params to generate transaction
  // const wallet = useWallet();
  // useEffect(() => {
  //   if (marketPubkey && wallet.publicKey) {
  //     (async () => {
  //       try {
  //         const connection = new web3.Connection(
  //           'https://api.devnet.solana.com',
  //         );

  //         const { transaction, signers } = await makeCreatePairTransaction({
  //           marketPubkey: new web3.PublicKey(marketPubkey),
  //           maxDuration: 7,
  //           maxLTV: 30,
  //           solDeposit: 0.02,
  //           solFee: 10,
  //           connection,
  //           wallet,
  //         });
  //         await signAndConfirmTransaction({
  //           transaction,
  //           signers,
  //           wallet,
  //           connection,
  //         });
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     })();
  //   }
  // }, [marketPubkey, wallet]);

  const goBack = () => {
    history.goBack();
  };
  return (
    <AppLayout>
      <div className={styles.poolsCreation}>
        <Header
          className={styles.headerWrapper}
          title="Order creation"
          onClick={goBack}
        />

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
                step={100}
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
      <OrderBook marketPubkey={marketPubkey} hideCreateBtn />
    </AppLayout>
  );
};

export default PoolsCreationPage;
