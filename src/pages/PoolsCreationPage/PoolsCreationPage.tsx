import { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { web3 } from 'fbonds-core';

import TokenField from '../../components/TokenField';
import { AppLayout } from '../../components/Layout/AppLayout';
import OrderBook from '../MarketPage/components/OrderBook/OrderBook';
import { SliderGradient } from './components/SliderGradient/SliderGradient';
import Header from '../BorrowPage/components/Header';
import Button from '../../components/Button';
import Tooltip from '@frakt/components/Tooltip';
import { LoadingModal } from '@frakt/components/LoadingModal';
import SizeField from './components/SizeFiled/SizeField';

import { riskMarks, usePoolCreation } from './hooks/usePoolCreation';
import { SOL_TOKEN } from '../../utils';
import { formatNumber } from '@frakt/utils/solanaUtils';
import { useNativeAccount } from '@frakt/utils/accounts';

import { SolanaIcon } from '@frakt/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './PoolsCreationPage.module.scss';
import RadioButton from './components/RadioButton/RadioButton';

const PoolsCreationPage: FC = () => {
  const { marketPubkey } = useParams<{ marketPubkey: string }>();

  const history = useHistory();
  const { account } = useNativeAccount();

  const {
    loadingModalVisible,
    closeLoadingModal,
    maxLTV,
    duration,
    solDeposit,
    solFee,
    handleMaxLTV,
    handleDuration,
    handleSolDeposit,
    handleSolFee,
    onSubmit,
    isValid,
  } = usePoolCreation();

  const goBack = () => {
    history.goBack();
  };

  const valueStr = +formatNumber.format(
    (account?.lamports || 0) / web3.LAMPORTS_PER_SOL,
  );

  return (
    <AppLayout>
      <div className={styles.poolsCreation}>
        <Header
          className={styles.headerWrapper}
          title="Offer parameters"
          onClick={goBack}
        />

        <div className={styles.block}>
          <div className={styles.floorPriceWrapper}>
            <h5 className={styles.floorPrice}>232.5 SOL</h5>
            <span className={styles.floor}>floor</span>
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
                min={10}
                max={100}
                withTooltip
              />

              <div className={styles.duration}>
                <h6 className={styles.subtitle}>duration</h6>
                <RadioButton
                  duration={duration}
                  handleDuration={handleDuration}
                  buttons={[{ value: '7' }, { value: '14' }]}
                />
              </div>
            </div>
            <div className={styles.col}>
              <h5 className={styles.blockTitle}>Offer parameters</h5>
              <SizeField
                value={String(solDeposit)}
                onValueChange={handleSolDeposit}
                label="SIZE"
                currentToken={SOL_TOKEN}
                lpBalance={valueStr}
                toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
              />

              <TokenField
                value={String(solFee)}
                onValueChange={handleSolFee}
                label="INTEREST"
                currentToken={SOL_TOKEN}
                tokensList={[SOL_TOKEN]}
                toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
              />
            </div>
          </div>

          <div className={styles.total}>
            <h5 className={styles.blockTitle}>Your total is 232.5 SOL</h5>
            <div className={styles.totalItem}>
              <div className={styles.totalTitle}>
                <span>you can fund</span>
              </div>
              <div className={styles.totalValue}>5 Loans</div>
            </div>
            <div className={styles.totalItem}>
              <div className={styles.totalTitle}>
                <span>apy</span>
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
                <span>estimated profit</span>
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
            disabled={!isValid}
            onClick={onSubmit}
            className={styles.btn}
            type="secondary"
          >
            {'Create pool'}
          </Button>
        </div>
      </div>
      <OrderBook marketPubkey={marketPubkey} hideCreateBtn />
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        subtitle="In order to create Bond"
      />
    </AppLayout>
  );
};

export default PoolsCreationPage;
