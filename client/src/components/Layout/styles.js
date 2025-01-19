import styled from 'styled-components';

export const LayoutContainer = styled.div`
    width: 100%;
    min-width: 1000px;
    overflow-x: auto;
`;

export const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    height: 50px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    min-width: 1000px;
    width: 100%;

    .logo {
        a {
            color: #1890ff;
            font-size: 16px;
            font-weight: bold;
            text-decoration: none;
            
            &:hover {
                color: #40a9ff;
            }
        }
    }
`;

export const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: auto;
    white-space: nowrap;
    padding-right: 15px;
    font-size: 13px;
    
    .header-item {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0 8px;
        color: #666;
        font-size: 13px;
        text-decoration: none;
        
        &:hover {
            color: #1890ff;
        }
        
        .anticon {
            margin-right: 4px;
            font-size: 14px;
        }
    }
    
    .points {
        color: #ff4d4f;
        font-weight: bold;
        font-size: 13px;
        margin-left: 4px;
    }

    .ant-avatar {
        width: 28px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
    }

    .ant-btn {
        padding: 4px 8px;
        height: 28px;
        font-size: 13px;
        min-height: 28px;
        line-height: 1;
    }
`; 