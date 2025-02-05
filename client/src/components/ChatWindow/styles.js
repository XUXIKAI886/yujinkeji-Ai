import styled from 'styled-components';
import { Button } from 'antd';

export const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    min-height: 600px;
    min-width: 1000px;
    position: relative;
    padding-bottom: 20px;
    background: #ffffff;
    border-radius: 8px;
    overflow-x: auto;
    overflow-y: auto;
`;

export const ChatHeader = styled.div`
    padding: 20px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    position: relative;
`;

export const HeaderTitle = styled.h2`
    margin: 0;
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
`;

export const HeaderDescription = styled.p`
    margin: 8px 0 0;
    color: #6b7280;
    font-size: 1rem;
`;

export const HeaderPoints = styled.div`
    margin-top: 8px;
    display: flex;
    align-items: center;

    .feature-points {
        display: flex;
        gap: 24px;
        width: 100%;
        
        span {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #4b5563;
            font-size: 0.9rem;

            .anticon {
                color: #3b82f6;
            }

            &.cost-points {
                color: #ef4444;
                font-weight: 500;

                .anticon {
                    color: #ef4444;
                }

                .file-cost {
                    color: #6b7280;
                    font-weight: normal;
                    margin-left: 4px;
                }
            }
        }
    }
`;

export const MessageList = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    margin-bottom: 10px;
    background: #ffffff;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
`;

export const InputArea = styled.div`
    padding: 15px 20px;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
`;

export const InputWrapper = styled.div`
    display: flex;
    gap: 12px;
    align-items: flex-start;
    position: relative;

    .ant-upload {
        position: absolute;
        right: 100px;
        bottom: 12px;
        z-index: 10;
    }

    .upload-btn {
        background: transparent;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        transition: all 0.3s ease;

        &:hover {
            color: #3b82f6;
            background: rgba(59, 130, 246, 0.1);
            border-radius: 4px;
        }

        .anticon {
            font-size: 20px;
        }
    }

    button {
        padding: 8px 16px;
        height: auto;
        display: flex;
        align-items: center;
        gap: 8px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            background: #2563eb;
        }

        &:disabled {
            background: #9ca3af;
            cursor: not-allowed;
        }
    }
`;

export const StyledInput = styled.textarea`
    flex: 1;
    height: 80px;
    padding: 16px 48px 16px 20px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    resize: none;
    font-size: 1rem;
    line-height: 1.5;
    color: #1f2937;
    background: #ffffff;
    transition: all 0.3s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    white-space: pre-wrap !important;
    overflow-y: auto;
    min-height: 80px;
    max-height: 200px;
    word-wrap: break-word;
    word-break: break-all;

    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &:disabled {
        background: #f3f4f6;
        cursor: not-allowed;
        opacity: 0.7;
    }

    &::placeholder {
        color: #9ca3af;
        white-space: pre-wrap;
    }
`;

export const UploadWrapper = styled.div`
    padding: 20px;
    background: #ffffff;
    border-radius: 8px;
    border: 2px dashed #e5e7eb;

    .ant-upload {
        width: 100%;
    }

    button {
        width: 100%;
        height: auto;
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: #f3f4f6;
        color: #4b5563;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            background: #e5e7eb;
            border-color: #d1d5db;
        }
    }
`;

export const FileList = styled.div`
    margin-top: 16px;
    
    .file-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: #f9fafb;
        border-radius: 4px;
        margin-bottom: 8px;

        .anticon {
            color: #6b7280;
        }

        .file-name {
            flex: 1;
            color: #1f2937;
            font-size: 0.875rem;
        }

        .file-size {
            color: #6b7280;
            font-size: 0.75rem;
        }
    }
`;

export const AnalyzeButton = styled(Button)`
    width: 100%;
    margin-top: 16px;
    height: auto;
    padding: 12px;
`;

export const ClearChatButton = styled(Button)`
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const Footer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    min-width: 1000px;
    padding: 15px;
    background: #fff;
    text-align: center;
    border-top: 1px solid #e8e8e8;
    z-index: 1000;
    
    a {
        margin: 0 10px;
        color: #666;
        text-decoration: none;
        
        &:hover {
            color: #1890ff;
        }
    }
`; 