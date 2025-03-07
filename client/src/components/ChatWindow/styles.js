import styled from 'styled-components';
import { Button } from 'antd';

export const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    position: relative;
    padding-bottom: 0;
    background: linear-gradient(to bottom, #f8fafc, #f3efff);
    border-radius: 0;
    overflow-x: hidden;
    overflow-y: auto;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    
    @media (max-width: 1200px) {
        border-radius: 0;
    }
`;

export const ChatHeader = styled.div`
    padding: 12px 24px;
    background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
    position: relative;
    border-radius: 0;
    box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
    
    &:after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 5%;
        right: 5%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(111, 66, 193, 0.3), rgba(138, 101, 217, 0.3), transparent);
    }
`;

export const HeaderTitle = styled.h2`
    margin: 0;
    color: #1e293b;
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    
    .anticon {
        color: #6f42c1;
        font-size: 1.2rem;
        background: rgba(111, 66, 193, 0.1);
        padding: 5px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(111, 66, 193, 0.15);
    }
`;

export const HeaderDescription = styled.p`
    margin: 4px 0 0;
    color: #64748b;
    font-size: 0.85rem;
    line-height: 1.35;
    max-width: 90%;
    transition: all 0.3s ease;
    
    &::first-letter {
        font-size: 1.05em;
        font-weight: 500;
    }
`;

export const HeaderPoints = styled.div`
    margin-top: 6px;
    display: flex;
    align-items: center;

    .feature-points {
        display: flex;
        gap: 16px;
        width: 100%;
        
        span {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #475569;
            font-size: 0.8rem;
            transition: all 0.3s ease;
            padding: 3px 8px;
            border-radius: 16px;
            background: rgba(241, 245, 249, 0.7);

            .anticon {
                color: #6f42c1;
            }

            &.cost-points {
                color: #ef4444;
                font-weight: 500;
                background: rgba(254, 226, 226, 0.5);

                .anticon {
                    color: #ef4444;
                }

                .file-cost {
                    color: #64748b;
                    font-weight: normal;
                    margin-left: 4px;
                }
            }
            
            &:hover {
                background: rgba(226, 232, 240, 0.9);
                transform: translateY(-1px);
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            }
        }
    }
`;

export const MessageList = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 28px 32px;
    margin-bottom: 0;
    background: #ffffff;
    background-image: 
        radial-gradient(rgba(111, 66, 193, 0.03) 1px, transparent 1px),
        radial-gradient(rgba(138, 101, 217, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: 0 0, 20px 20px;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(241, 245, 249, 0.8);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.5);
        border-radius: 4px;
        transition: all 0.3s ease;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #6f42c1;
    }
`;

export const InputArea = styled.div`
    padding: 22px 32px;
    background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
    border-top: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 0;
    transition: all 0.3s ease;
    position: relative;
    
    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 5%;
        right: 5%;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(111, 66, 193, 0.3), rgba(138, 101, 217, 0.3), transparent);
    }
`;

export const InputWrapper = styled.div`
    display: flex;
    gap: 16px;
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
        color: #64748b;
        cursor: pointer;
        padding: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        transition: all 0.3s ease;
        border-radius: 10px;

        &:hover {
            color: #6f42c1;
            background: rgba(111, 66, 193, 0.1);
            transform: translateY(-2px);
        }

        .anticon {
            font-size: 20px;
        }
    }

    button {
        padding: 12px 20px;
        height: auto;
        display: flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #8a65d9 0%, #6f42c1 100%);
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.25s ease;
        font-weight: 500;
        box-shadow: 0 4px 10px rgba(111, 66, 193, 0.2), 0 1px 2px rgba(111, 66, 193, 0.3);

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(111, 66, 193, 0.25), 0 2px 4px rgba(111, 66, 193, 0.35);
            filter: brightness(1.05);
        }

        &:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2);
        }

        &:disabled {
            background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
    }
`;

export const StyledInput = styled.textarea`
    flex: 1;
    height: 90px;
    padding: 18px 50px 18px 22px;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    resize: none;
    font-size: 1rem;
    line-height: 1.5;
    color: #1e293b;
    background: rgba(252, 252, 255, 0.95);
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03), 0 0 1px rgba(0, 0, 0, 0.1);
    white-space: pre-wrap !important;
    overflow-y: auto;
    word-wrap: break-word;
    word-break: break-all;

    &:focus {
        outline: none;
        border-color: #8a65d9;
        box-shadow: 0 0 0 3px rgba(111, 66, 193, 0.15), 0 2px 10px rgba(0, 0, 0, 0.05);
        background: #ffffff;
    }

    &:disabled {
        background: #f8fafc;
        cursor: not-allowed;
        opacity: 0.7;
    }

    &::placeholder {
        color: #94a3b8;
        white-space: pre-wrap;
    }
    
    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(241, 245, 249, 0.5);
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.5);
        border-radius: 3px;
    }
`;

export const UploadWrapper = styled.div`
    padding: 24px;
    background: #ffffff;
    border-radius: 12px;
    border: 2px dashed #e5e7eb;
    transition: all 0.3s ease;

    &:hover {
        border-color: #3b82f6;
        background: rgba(59, 130, 246, 0.02);
    }

    .ant-upload {
        width: 100%;
    }

    button {
        width: 100%;
        height: auto;
        padding: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        background: #f3f4f6;
        color: #4b5563;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;

        &:hover {
            background: #e5e7eb;
            border-color: #d1d5db;
            color: #3b82f6;
        }
        
        .anticon {
            font-size: 18px;
            color: #3b82f6;
        }
    }
`;

export const FileList = styled.div`
    margin-top: 20px;
    
    .file-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: #f8fafc;
        border-radius: 12px;
        margin-bottom: 12px;
        transition: all 0.3s ease;
        border: 1px solid #e2e8f0;
        
        &:hover {
            background: #eef2ff;
            border-color: #c7d2fe;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .anticon {
            color: #6366f1;
            font-size: 18px;
            background: rgba(99, 102, 241, 0.1);
            padding: 8px;
            border-radius: 10px;
        }

        .file-name {
            flex: 1;
            font-size: 0.95rem;
            color: #475569;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .file-size {
            font-size: 0.8rem;
            color: #64748b;
            background: rgba(241, 245, 249, 0.8);
            padding: 2px 8px;
            border-radius: 12px;
        }

        .delete-btn {
            color: #94a3b8;
            cursor: pointer;
            font-size: 18px;
            transition: all 0.2s ease;
            background: rgba(241, 245, 249, 0.8);
            padding: 5px;
            border-radius: 8px;

            &:hover {
                color: #ef4444;
                transform: scale(1.1);
                background: rgba(254, 226, 226, 0.5);
            }
        }
    }
`;

export const AnalyzeButton = styled(Button)`
    margin-top: 16px;
    height: auto;
    padding: 12px 18px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.25s ease;
    font-weight: 500;
    box-shadow: 0 2px 5px rgba(59, 130, 246, 0.2);

    &:hover {
        background: #2563eb;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
    }

    &:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`;

export const ClearChatButton = styled.button`
    position: absolute;
    top: 20px;
    right: 24px;
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 8px 14px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
        color: #ef4444;
        background: rgba(254, 226, 226, 0.5);
        transform: translateY(-1px);
    }

    .anticon {
        font-size: 16px;
    }
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