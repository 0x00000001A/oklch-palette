import {createStyles, css} from 'antd-style'

export const useTableStyles = createStyles(({token}) => ({
  root: css`
    height: 100%;
    overflow: auto;
    overscroll-behavior: none;
    width: 100%;
  `,
  table: css`
    border: none;
    border-collapse: collapse;
    border-spacing: 0;

    tr[aria-pressed] td div,
    tr[aria-pressed] td div:hover {
      transition: none;
      border-radius: 0;
      transform: none;
    }
  `,
  tableCell: css`
    padding: 0;
  `,
  tableColNameCell: css`
    background: ${token.colorBgElevated};
    min-width: 60px;
    padding: ${token.sizeXS}px ${token.sizeXXS}px;
    width: 60px;
  `,
  tableColumnRemoveCell: css`
    background: ${token.colorBgElevated};
    min-width: 60px;
    padding: ${token.sizeXS}px ${token.sizeXXS}px;
    width: 60px;
    text-align: center;
  `,
  tableRowActionCell: css`
    background: ${token.colorBgElevated};
    right: 0;
    padding: ${token.sizeXXS}px ${token.sizeXS}px;
    position: sticky;
    z-index: 999;
  `,
  tableRowFooter: css`
    background: ${token.colorBgElevated};
    bottom: 0;
    left: 0;
    position: sticky;
    z-index: 1000;
  `,
  tableRowHead: css`
    left: 0;
    position: sticky;
    top: 0;
    z-index: 1000;
  `,
  tableRowNameCell: css`
    background: ${token.colorBgElevated};
    left: 0;
    min-width: 150px;
    padding: ${token.sizeXXS}px ${token.sizeXS}px;
    position: sticky;
    width: 150px;
    z-index: 999;
  `
}))

export const useCellStyles = createStyles(
  ({token}, props: {color: string; isSelected: boolean; isValid?: boolean}) => ({
    root: css`
      display: flex;
      align-items: center;
      justify-content: center;
      --color-a: ${token.colorFillContent};
      --color-b: ${token.colorBgLayout};
      background: ${props.isValid
        ? props.color
        : `linear-gradient( -45deg, var(--color-a) 25%, var(--color-b) 25%, var(--color-b) 50%, var(--color-a) 50%, var(--color-a) 75%, var(--color-b) 75%, var(--color-b))`};
      background-size: 6px 6px;
      height: 40px;
      position: relative;
      width: 64px;
      border-radius: ${props.isSelected ? '2px' : 'unset'};
      z-index: ${props.isSelected ? '997' : 'unset'};
      transform: ${props.isSelected ? 'scale(1.2)' : 'unset'};
      transition: transform 0.025s linear;
      &:hover {
        z-index: 998;
        transform: scale(1.2);
        border-radius: 2px;
      }
    `
  })
)
