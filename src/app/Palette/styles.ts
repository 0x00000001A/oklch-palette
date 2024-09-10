import {createStyles, css} from 'antd-style'

export const useTableStyles = createStyles(({token}) => ({
  root: css`
    .ant-table {
      border-radius: 0;
    }
    .ant-table .ant-table-container .ant-table-tbody > tr > .ant-table-cell:first-child {
      min-width: 160px;
      padding: 0 ${token.sizeXS}px;
    }
    .ant-table .ant-table-container .ant-table-tbody > tr > .ant-table-cell:last-child {
      padding: 0 ${token.sizeXS}px;
    }
    .ant-table .ant-table-container .ant-table-tbody > tr > .ant-table-cell {
      padding: 0;
      width: 64px;
      max-width: 64px;
      white-space: nowrap;
      border-width: 0;
    }
    .ant-table-summary .ant-table-cell.ant-table-cell-fix-left:first-child {
      z-index: 123;
    }
    overflow: hidden;
  `
}))

// noinspection CssUnresolvedCustomProperty
export const useCellStyles = createStyles(
  ({token}, props: {color: string; isSelected: boolean}) => ({
    root: css`
      --box-shadow: inset 0 0 0 2px ${token.colorBorderBg};
      background: ${props.color};
      height: 40px;
      width: 64px;
      box-shadow: ${props.isSelected ? 'var(--box-shadow)' : 'unset'};
      &:hover {
        box-shadow: var(--box-shadow);
      }
    `
  })
)
