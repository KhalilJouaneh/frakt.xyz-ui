import React, { FC, useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import TokenField from '../../components/TokenField';
import { AppLayout } from '../../components/Layout/AppLayout';
import Button from '../../components/Button';

import Header from '../BorrowPage/components/Header';

import { riskMarks } from './hooks/usePoolCreation';
import OrderBook from '../MarketPage/components/OrderBook/OrderBook';
import { SOL_TOKEN } from '../../utils';

import { SolanaIcon } from '@frakt/icons';
import Tooltip from '@frakt/components/Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';
import SizeField from './components/SizeFiled/SizeField';
import { SliderGradient } from './components/SliderGradient/SliderGradient';
import styles from './PoolsCreationPage.module.scss';

// import { TokenAmountInput } from '@frakt/components/TokenAmountInput';
// import { makeCreatePairTransaction } from '@frakt/utils/bonds';
// import { signAndConfirmTransaction } from '@frakt/utils/transactions';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { web3 } from 'fbonds-core';

const PoolsCreationPage: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();

  const history = useHistory();

  const [maxLTV, setMaxLTV] = useState<number>(0);
  const [duration, setDuration] = useState<number>(7);
  const [solDeposit, setSolDeposit] = useState<number>(0);
  const [solFee, setSolFee] = useState<number>(0);

  const handleMaxLTV = useCallback((value: number) => setMaxLTV(value), []);

  const handleDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(+e.target.value);
  };

  const handleSolDeposit = (value: string) => {
    setSolDeposit(+value);
  };

  const handleSolFee = (value: string) => {
    setSolFee(+value);
  };

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
          <div className={styles.floorPriceWrapper}>
            <h5 className={styles.floorPrice}>232.5 SOL</h5>
            <span>FLOOR</span>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.col}>
              <h5 className={styles.blockTitle}>Loan parameters</h5>
              <SliderGradient
                value={maxLTV}
                setValue={handleMaxLTV}
                className={styles.slider}
                marks={riskMarks}
                label="LTV"
                step={1}
                min={0}
                max={100}
                withTooltip
              />

              <div className={styles.duration}>
                <h6 className={styles.subtitle}>duration</h6>
                <div className={styles.btnWrapper}>
                  <div className={styles.btnRadio}>
                    <input
                      type="radio"
                      id="7"
                      name="maxDuration"
                      value="7"
                      checked={duration === 7 ? true : false}
                      onChange={handleDuration}
                    />
                    <label htmlFor="7">7 days</label>
                  </div>
                  <div className={styles.btnRadio}>
                    <input
                      type="radio"
                      id="14"
                      name="maxDuration"
                      value="14"
                      checked={duration === 14 ? true : false}
                      onChange={handleDuration}
                    />
                    <label htmlFor="14">14 days</label>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.col}>
              <h5 className={styles.blockTitle}>Offer parameters</h5>
              <SizeField
                value={String(solDeposit)}
                onValueChange={handleSolDeposit}
                label="SIZE"
                currentToken={SOL_TOKEN}
                onUseMaxButtonClick={() => {}}
                lpBalance={123}
                toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
              />

              <TokenField
                value={String(solFee)}
                onValueChange={handleSolFee}
                label="INTEREST"
                currentToken={SOL_TOKEN}
                tokensList={[SOL_TOKEN, SOL_TOKEN]}
                toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
              />
            </div>
          </div>

          <div className={styles.total}>
            <h5 className={styles.blockTitle}>Your total is 232.5 SOL</h5>
            <div className={styles.totalItem}>
              <div className={styles.totalTitle}>YOU CAN FUND</div>
              <div className={styles.totalValue}>5 Loans</div>
            </div>
            <div className={styles.totalItem}>
              <div className={styles.totalTitle}>
                <span>APY</span>
                <Tooltip
                  placement="bottom"
                  overlay="Analyzed profit from repaying the loan"
                >
                  <QuestionCircleOutlined className={styles.questionIcon} />
                </Tooltip>
              </div>
              <div className={styles.totalValue}>123.11 %</div>
            </div>
            <div className={styles.totalItem}>
              <div className={styles.totalTitle}>
                <span>ESTIMATED PROFIT</span>
                <Tooltip
                  placement="bottom"
                  overlay="Analyzed profit from repaying the loan"
                >
                  <QuestionCircleOutlined className={styles.questionIcon} />
                </Tooltip>
              </div>
              <div className={styles.totalValue}>
                58.4 <SolanaIcon />
              </div>
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
