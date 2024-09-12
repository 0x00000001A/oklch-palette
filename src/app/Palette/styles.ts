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
  (_, props: {color: string; isSelected: boolean}) => ({
    root: css`
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${props.color};
      height: 40px;
      position: relative;
      width: 64px;
      border-radius: ${props.isSelected ? '2px' : 'unset'};
      z-index: ${props.isSelected ? '4' : 'unset'};
      transform: ${props.isSelected ? 'scale(1.2)' : 'unset'};
      &:hover {
        z-index: 1000;
        transform: scale(1.2);
        border-radius: 2px;
      }
    `
  })
)
