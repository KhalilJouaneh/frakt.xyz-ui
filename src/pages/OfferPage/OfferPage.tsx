import { FC } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';

import { Solana } from '@frakt/icons';
import Tooltip from '@frakt/components/Tooltip';
import { LoadingModal } from '@frakt/components/LoadingModal';

import TokenField from '../../components/TokenField';
import { AppLayout } from '../../components/Layout/AppLayout';
import OrderBook from '../MarketPage/components/OrderBook/OrderBook';
import Button from '../../components/Button';
import SizeField from './components/SizeField/SizeField';
import { RadioButton } from './components/RadioButton';
import { SliderGradient } from './components/SliderGradient/SliderGradient';
import { Header } from './components/Header';
import { useOfferPage } from './hooks';
import { SOL_TOKEN } from '../../utils';
import styles from './OfferPage.module.scss';
import { DURATION_OPTIONS } from './constants';

export const OfferPage = () => {
  const {
    loadingModalVisible,
    closeLoadingModal,
    ltv,
    duration,
    offerSize,
    interest,
    onLtvChange,
    onDurationChange,
    onOfferSizeChange,
    onInterestChange,
    onCreateOffer,
    isValid,
    isEdit,
    goBack,
    walletSolBalance,
    market,
    isLoading,
    onEditOffer,
    onRemoveOffer,
    // autocompound,
    // toggleAutocompound,
    receiveLiquidatedNfts,
    toggleReceiveLiquidatedNfts,
  } = useOfferPage();

  return (
    <AppLayout>
      <div className={styles.poolsCreation}>
        <Header
          className={styles.headerWrapper}
          title={isEdit ? 'Offer editing' : 'Offer creation'}
          onBackBtnClick={goBack}
        />

        <div className={styles.block}>
          <div className={styles.floorWrapper}>
            <div className={styles.floorCard}>
              <h6 className={styles.floorCardTitle}>collection</h6>

              <div className={styles.cardCollection}>
                <img
                  className={styles.collectionImage}
                  src={market?.collectionImage}
                  alt={market?.collectionName}
                />
                <span className={styles.floorCardValue}>
                  {!isLoading ? market?.collectionName : '--'}
                </span>
              </div>
            </div>
            <div className={styles.floorCard}>
              <h6 className={styles.floorCardTitle}>floor</h6>
              <span
                className={classNames(styles.floorCardValue, styles.florPrice)}
              >
                {!isLoading
                  ? (market?.oracleFloor.floor / 1e9).toFixed(2) + ' sol'
                  : '--'}
              </span>
            </div>
          </div>
          <h5 className={styles.blockTitle}>Loan parameters</h5>
          <SliderGradient value={ltv} setValue={onLtvChange} />

          <div className={styles.radio}>
            <h6 className={styles.subtitle}>duration</h6>
            <RadioButton
              currentOption={{
                label: `${duration} days`,
                value: duration,
              }}
              onOptionChange={onDurationChange}
              options={DURATION_OPTIONS}
            />
          </div>

          <SizeField
            value={offerSize}
            onValueChange={onOfferSizeChange}
            label="SIZE"
            currentToken={SOL_TOKEN}
            lpBalance={parseFloat((walletSolBalance / 1e9).toFixed(3))}
            toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
          />
          <TokenField
            value={interest}
            onValueChange={onInterestChange}
            label="Interest"
            currentToken={{
              ...SOL_TOKEN,
              symbol: '%',
              logoURI: null,
              name: null,
            }}
            tokensList={[
              { ...SOL_TOKEN, symbol: '%', logoURI: null, name: null },
            ]}
            toolTipText="Yearly rewards based on the current utilization rate and borrow interest"
          />

          {/* <div className={styles.checkbox}>
            <label className={styles.checkboxLabel}>
              <input
                className={styles.checkboxInput}
                type="checkbox"
                name="checkbox"
                checked={autocompound}
                onChange={toggleAutocompound}
              />
              Autocompound
            </label>
            <Tooltip
              placement="bottom"
              overlay="Deposit rewards back into offer"
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div> */}

          <div className={styles.checkbox}>
            <label className={styles.checkboxLabel}>
              <input
                className={styles.checkboxInput}
                type="checkbox"
                name="checkbox"
                checked={receiveLiquidatedNfts}
                onChange={toggleReceiveLiquidatedNfts}
              />
              Receive liquidated NFTs
            </label>
            <Tooltip
              placement="bottom"
              overlay="Receive collaterized NFT instead of SOL in case of liquidation and funding a whole loan "
            >
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          </div>

          <TotalOverview
            size={parseFloat(offerSize)}
            interest={parseFloat(interest)}
            duration={duration}
          />
          <div className={styles.btnsWrapper}>
            {isEdit && (
              <>
                <Button
                  onClick={onRemoveOffer}
                  className={classNames(styles.btn, styles.btnDelete)}
                  type="primary"
                >
                  Delete offer
                </Button>
                <Button
                  onClick={onEditOffer}
                  className={styles.btn}
                  type="secondary"
                >
                  Update offer
                </Button>
              </>
            )}
            {!isEdit && (
              <Button
                disabled={!isValid}
                onClick={isEdit ? onEditOffer : onCreateOffer}
                className={styles.btn}
                type="secondary"
              >
                Place offer
              </Button>
            )}
          </div>
        </div>
      </div>
      {!isLoading && !!market && (
        <OrderBook
          market={market}
          hideEditButtons
          syntheticParams={{
            ltv,
            offerSize: parseFloat(offerSize) * 1e9 || 0,
            interest: parseFloat(interest) || 0,
            durationDays: duration,
          }}
        />
      )}
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        subtitle="In order to create Bond"
      />
    </AppLayout>
  );
};

interface TotalOverviewProps {
  size?: number;
  interest?: number;
  duration?: number;
}

const TotalOverview: FC<TotalOverviewProps> = ({
  size = 0,
  interest = 0,
  duration = 7,
}) => {
  const apr = (interest / duration) * 365;

  const estProfit = size * (interest / 1e2);

  return (
    <div className={styles.total}>
      <h5 className={styles.blockTitle}>Your total is {size || 0} SOL</h5>
      <div className={styles.totalItem}>
        <div className={styles.totalTitle}>
          <span>apr</span>
          <Tooltip
            placement="bottom"
            overlay="Analyzed profit from repaying the loan"
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </div>
        <div className={styles.totalValue}>{(apr || 0).toFixed(2)} %</div>
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
          {(estProfit || 0).toFixed(3)} <Solana />
        </div>
      </div>
    </div>
  );
};
