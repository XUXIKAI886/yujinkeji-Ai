import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout, Badge, Tooltip, Button, Modal, Table, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  WechatOutlined,
  ShareAltOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CalculatorOutlined,
  ShopOutlined,
  ToolOutlined
} from '@ant-design/icons';
import Sidebar from './Sidebar';
import UserInfo from './UserInfo';
import ChatWindow from './ChatWindow/index';
import { useAuth } from '../contexts/AuthContext';
import { getUserPointsHistory } from '../services/userService';
import http from '../utils/http';

const { Header, Sider, Content } = Layout;

const StyledLayout = styled(Layout)`
  height: 100vh;
  background: #f8fafc;
`;

const StyledHeader = styled(Header)`
  background: rgba(0, 4, 40, 0.85);
  backdrop-filter: blur(10px);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  min-width: 1200px;
  
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    background-image: 
      radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.95), rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 50px 160px, rgba(255, 255, 255, 0.85), rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 80px 120px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
      radial-gradient(1.5px 1.5px at 110px 50px, rgba(255, 255, 255, 0.85), rgba(0, 0, 0, 0)),
      radial-gradient(1.5px 1.5px at 150px 180px, rgba(255, 255, 255, 0.8), rgba(0, 0, 0, 0));
    background-repeat: repeat;
    background-size: 250px 250px;
    transform-origin: 0 0;
    animation: animateStars 25s linear infinite;
    opacity: 0.6;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%);
    background-size: 250% 250%;
    animation: meteor 6s linear infinite;
    z-index: 2;
  }

  > * {
    position: relative;
    z-index: 10;
  }
`;

const StyledSider = styled(Sider)`
  background: rgba(0, 4, 40, 0.85);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  width: ${props => props.collapsed ? '50px' : '200px'} !important;
  min-width: ${props => props.collapsed ? '50px' : '200px'} !important;
  max-width: ${props => props.collapsed ? '50px' : '200px'} !important;

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    z-index: 1;
    width: 100%;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.95), rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 50px 160px, rgba(255, 255, 255, 0.85), rgba(0, 0, 0, 0)),
      radial-gradient(1px 1px at 80px 120px, rgba(255, 255, 255, 0.9), rgba(0, 0, 0, 0)),
      radial-gradient(1.5px 1.5px at 110px 50px, rgba(255, 255, 255, 0.85), rgba(0, 0, 0, 0)),
      radial-gradient(1.5px 1.5px at 150px 180px, rgba(255, 255, 255, 0.8), rgba(0, 0, 0, 0));
    background-size: 200px 200px;
    animation: animateSiderStars 20s linear infinite;
    opacity: 0.5;
  }

  @keyframes animateSiderStars {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-200px);
    }
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 0 0 auto;
  padding-left: 16px;
  position: relative;
  z-index: 10;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
  white-space: nowrap;
`;

const MenuButton = styled(Button)`
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8) !important;
  &:hover {
    color: rgba(255, 255, 255, 1) !important;
    background: rgba(255, 255, 255, 0.1) !important;
  }
`;

const ActionButton = styled(Button)`
  height: 36px;
  padding: 0 20px;
  font-size: 14px;
  border-radius: 12px;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 15;

  &:hover {
    color: white !important;
    background: rgba(255, 255, 255, 0.15) !important;
    transform: translateY(-1px);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2),
                0 4px 12px rgba(111, 66, 193, 0.3);
                
    .anticon {
      color: #ffffff !important;
      opacity: 1;
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(0);
    background: rgba(255, 255, 255, 0.1) !important;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .anticon {
    font-size: 16px;
    transition: all 0.3s ease;
    color: rgba(255, 255, 255, 0.85);
    
    svg {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
  }

  &:has(.ant-badge) {
    min-width: 140px;
    max-width: 140px;
    padding: 0 16px;
    justify-content: space-between;
    
    .anticon {
      margin-right: 0;
    }
  }
`;

const PointsHistoryButton = styled(ActionButton)`
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
  color: #ffffff !important;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
              0 4px 8px rgba(111, 66, 193, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    z-index: 1;
  }

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3),
                0 8px 24px rgba(111, 66, 193, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #ffffff !important;
    opacity: 0.95;
    font-size: 16px;
    z-index: 2;
    margin-right: 8px;
  }

  &:hover .anticon {
    color: #ffffff !important;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const PointsButton = styled(ActionButton)`
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
  color: #ffffff !important;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
              0 4px 8px rgba(111, 66, 193, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  min-width: 150px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    z-index: 1;
  }

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3),
                0 8px 24px rgba(111, 66, 193, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #ffffff !important;
    opacity: 0.95;
    font-size: 16px;
    z-index: 2;
    margin-right: 8px;
  }

  &:hover .anticon {
    color: #ffffff !important;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const PointsBadge = styled(Badge)`
  .ant-badge-count {
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    color: #ffffff !important;
    font-weight: 600;
    font-size: 14px;
    padding: 0 8px;
    height: 24px;
    line-height: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(148, 194, 189, 0.2);
    min-width: 60px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.8);
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
    }
  }

  .ant-badge-count-overflow {
    min-width: 60px;
    text-align: center;
  }
`;

const StyledContent = styled(Content)`
  background: #ffffff;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 24px;
`;

const ServiceButton = styled(ActionButton)`
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
  color: #ffffff !important;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
              0 4px 8px rgba(111, 66, 193, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3),
                0 8px 24px rgba(111, 66, 193, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: translateY(0);
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
                inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .anticon {
    color: #ffffff !important;
    opacity: 0.95;
    font-size: 16px;
    
    svg {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
  }

  &:hover .anticon {
    color: #ffffff !important;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const MindMapButton = styled(ActionButton)`
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
  color: #ffffff !important;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
              0 4px 8px rgba(111, 66, 193, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3),
                0 8px 24px rgba(111, 66, 193, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #ffffff !important;
    opacity: 0.95;
    font-size: 16px;
  }

  &:hover .anticon {
    color: #ffffff !important;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const PerformanceButton = styled(ActionButton)`
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
  color: #ffffff !important;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
              0 4px 8px rgba(111, 66, 193, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3),
                0 8px 24px rgba(111, 66, 193, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #ffffff !important;
    opacity: 0.95;
    font-size: 16px;
  }

  &:hover .anticon {
    color: #ffffff !important;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const DocsButton = styled(ActionButton)`
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
  color: #ffffff !important;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
              0 4px 8px rgba(111, 66, 193, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3),
                0 8px 24px rgba(111, 66, 193, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #ffffff !important;
    opacity: 0.95;
    font-size: 16px;
  }

  &:hover .anticon {
    color: #ffffff !important;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const VisualizationButton = styled(ActionButton)`
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
  color: #ffffff !important;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
              0 4px 8px rgba(111, 66, 193, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3),
                0 8px 24px rgba(111, 66, 193, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #ffffff !important;
    opacity: 0.95;
    font-size: 16px;
  }

  &:hover .anticon {
    color: #ffffff !important;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const ReviewAnalysisButton = styled(ActionButton)`
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
  color: #ffffff !important;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
              0 4px 8px rgba(111, 66, 193, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3),
                0 8px 24px rgba(111, 66, 193, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #ffffff !important;
    opacity: 0.95;
    font-size: 16px;
  }

  &:hover .anticon {
    color: #ffffff !important;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const VendorStatsButton = styled(ActionButton)`
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
  color: #ffffff !important;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
              0 4px 8px rgba(111, 66, 193, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3),
                0 8px 24px rgba(111, 66, 193, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #ffffff !important;
    opacity: 0.95;
    font-size: 16px;
  }

  &:hover .anticon {
    color: #ffffff !important;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const SalesVisualizationButton = styled(ActionButton)`
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
  color: #ffffff !important;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
              0 4px 8px rgba(111, 66, 193, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3),
                0 8px 24px rgba(111, 66, 193, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #ffffff !important;
    opacity: 0.95;
    font-size: 16px;
  }

  &:hover .anticon {
    color: #ffffff !important;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const BusinessDistrictButton = styled(ActionButton)`
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
  color: #ffffff !important;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
              0 4px 8px rgba(111, 66, 193, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3),
                0 8px 24px rgba(111, 66, 193, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #ffffff !important;
    opacity: 0.95;
    font-size: 16px;
  }

  &:hover .anticon {
    color: #ffffff !important;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const DevToolsButton = styled(ActionButton)`
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
  color: #ffffff !important;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
              0 4px 8px rgba(111, 66, 193, 0.1),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3),
                0 8px 24px rgba(111, 66, 193, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #ffffff !important;
    opacity: 0.95;
    font-size: 16px;
  }

  &:hover .anticon {
    color: #ffffff !important;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const CompetitorButton = styled(ActionButton)`
  background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
  color: #ffffff !important;
  padding: 0 24px;
  box-shadow: 0 2px 4px rgba(111, 66, 193, 0.2),
               0 4px 8px rgba(111, 66, 193, 0.1),
               inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(123, 97, 255, 0.8) 0%, rgba(78, 168, 222, 0.8) 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3),
                0 8px 24px rgba(111, 66, 193, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .anticon {
    color: #ffffff !important;
    opacity: 0.95;
    font-size: 16px;
  }

  &:hover .anticon {
    color: #ffffff !important;
    opacity: 1;
    transform: scale(1.1);
  }
`;

const ChatLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [wechatModalVisible, setWechatModalVisible] = useState(false);
  const { user, updateUser } = useAuth();

  const showPointsHistory = React.useCallback(async () => {
    try {
        // 先获取最新的用户信息
        const userResponse = await http.get('/users/me');
        console.log('当前用户信息:', userResponse.data);
        
        if (userResponse.data.success) {
            updateUser(userResponse.data.data);
        }

        // 强制刷新积分历史
        const response = await getUserPointsHistory(userResponse.data.data._id || user._id);
        console.log('积分历史原始数据:', response);
        
        // 确保数据存在且是数组
        if (!response.success || !Array.isArray(response.data)) {
            console.error('积分历史数据格式错误:', response);
            message.error('获取积分历史失败');
            return;
        }

        const historyData = response.data;
        console.log('处理后的积分历史数据:', historyData);
        
        // 关闭之前的 Modal（如果存在）
        Modal.destroyAll();
        
        // 显示新的 Modal
        Modal.info({
            title: '积分变动历史',
            width: 800,
            content: (
                <Table
                    dataSource={historyData}
                    columns={[
                        {
                            title: '变动时间',
                            dataIndex: 'createdAt',
                            key: 'createdAt',
                            render: (date) => new Date(date).toLocaleString()
                        },
                        {
                            title: '变动积分',
                            dataIndex: 'points',
                            key: 'points',
                            render: (points, record) => {
                                // 根据类型确定是否显示正负号
                                const isPositive = ['add', 'register'].includes(record.type) || 
                                                  (record.type === 'admin_grant' && points > 0);
                                
                                // 对于消费类型，points已经是负数，不需要再加负号
                                const displayPoints = Math.abs(points);
                                
                                return (
                                    <span style={{ 
                                        color: isPositive ? '#52c41a' : '#ff4d4f' 
                                    }}>
                                        {isPositive ? `+${displayPoints}` : `-${displayPoints}`}
                                    </span>
                                );
                            }
                        },
                        {
                            title: '变动类型',
                            dataIndex: 'type',
                            key: 'type',
                            render: (type) => {
                                const typeMap = {
                                    'register': '注册奖励',
                                    'use_assistant': 'AI助手使用',
                                    'admin_grant': '管理员调整',
                                    'add': '充值'
                                };
                                return typeMap[type] || type;
                            }
                        },
                        {
                            title: '变动说明',
                            dataIndex: 'description',
                            key: 'description'
                        },
                        {
                            title: '剩余积分',
                            dataIndex: 'balance',
                            key: 'balance'
                        }
                    ]}
                    pagination={{
                        total: historyData.length,
                        pageSize: 50,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`,
                        pageSizeOptions: ['10', '20', '50', '100', '200']
                    }}
                    rowKey="_id"
                    locale={{ emptyText: '暂无积分记录' }}
                    scroll={{ y: 500 }}
                />
            ),
            okText: '关闭'
        });
    } catch (error) {
        console.error('获取积分历史失败:', error);
        message.error('获取积分历史失败');
    }
  }, [user, updateUser]);

  useEffect(() => {
    const handlePointsUpdate = async () => {
      try {
        const response = await http.get('/users/me', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (response.data.success && response.status !== 304) {
          updateUser(response.data.data);
        }
      } catch (error) {
        console.error('更新用户信息失败:', error);
      }
    };

    window.addEventListener('userPointsUpdate', handlePointsUpdate);
    return () => window.removeEventListener('userPointsUpdate', handlePointsUpdate);
  }, [updateUser]);

  const handlePointsClick = async () => {
    try {
      const response = await http.get('/users/me', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.data.success) {
        updateUser(response.data.data);
      }
      showPointsHistory();
    } catch (error) {
      console.error('获取用户信息失败:', error);
      message.error('获取用户信息失败');
    }
  };

  const handleSelectAssistant = (assistant) => {
    setSelectedAssistant(assistant);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMindMapClick = () => {
    if (!user) {
      message.warning('请先登录后再使用思维导图功能');
      return;
    }
    window.open('/mindmap', '_blank');
  };

  const handleDocsClick = () => {
    window.open('/docs/ai-assistant-manual.html', '_blank');
  };

  const handleVisualizationClick = () => {
    if (!user) {
      message.warning('请先登录后再使用数据可视化功能');
      return;
    }
    window.open('/visualization', '_blank');
  };

  const handleCompetitorClick = () => {
    if (!user) {
      message.warning('请先登录后再使用竞店数据功能');
      return;
    }
    window.open('/competitor-store-analysis', '_blank');
  };

  const handleVendorStatsClick = () => {
    if (!user) {
      message.warning('请先登录后再使用服务商统计功能');
      return;
    }
    window.open('/vendor-statistics', '_blank');
  };

  const handleBusinessDistrictClick = () => {
    if (!user) {
      message.warning('请先登录后再使用商圈数据功能');
      return;
    }
    window.open('/business-district-analysis', '_blank');
  };

  const handleDevToolsClick = () => {
    if (!user) {
      message.warning('请先登录后再使用开发软件合集功能');
      return;
    }
    window.open('/dev-tools-collection', '_blank');
  };

  const handleWechatClick = () => {
    setWechatModalVisible(true);
  };

  return (
    <StyledLayout>
      <StyledSider
        width={collapsed ? 50 : 200}
        collapsed={collapsed}
        trigger={null}
        collapsible
      >
        <Sidebar
          onSelectAssistant={handleSelectAssistant}
          collapsed={collapsed}
        />
      </StyledSider>
      <Layout>
        <StyledHeader>
          <HeaderLeft>
            <MenuButton
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleCollapsed}
            />
          </HeaderLeft>
          <HeaderRight>
            <DevToolsButton
              icon={<ToolOutlined />}
              onClick={handleDevToolsClick}
            >
              开发软件合集
            </DevToolsButton>
            <CompetitorButton
              type="default"
              icon={<ShopOutlined />}
              onClick={handleCompetitorClick}
            >
              竞店数据
            </CompetitorButton>
            <BusinessDistrictButton 
              type="default" 
              icon={<ShopOutlined />} 
              onClick={handleBusinessDistrictClick}
            >
              商圈数据
            </BusinessDistrictButton>
            <SalesVisualizationButton 
              type="default" 
              icon={<BarChartOutlined />} 
              onClick={() => window.open('/sales-visualization', '_blank')}
            >
              图表可视化（销售）
            </SalesVisualizationButton>
            <VisualizationButton type="default" icon={<BarChartOutlined />} onClick={handleVisualizationClick}>
              数据可视化
            </VisualizationButton>
            <ReviewAnalysisButton type="default" icon={<PieChartOutlined />} onClick={() => window.open('/takeout-review-analysis', '_blank')}>
              外卖评价分析
            </ReviewAnalysisButton>
            <MindMapButton type="default" icon={<ShareAltOutlined />} onClick={handleMindMapClick}>
              思维导图
            </MindMapButton>
            <PerformanceButton type="default" icon={<CalculatorOutlined />} onClick={() => window.open('/performance-stats', '_blank')}>
              绩效统计
            </PerformanceButton>
            <VendorStatsButton type="default" icon={<LineChartOutlined />} onClick={handleVendorStatsClick}>
              服务商统计
            </VendorStatsButton>
            <DocsButton type="default" icon={<FileTextOutlined />} onClick={handleDocsClick}>
              使用文档
            </DocsButton>
            <ServiceButton type="default" icon={<WechatOutlined />} onClick={handleWechatClick}>
              微信客服
            </ServiceButton>
            <Tooltip title="积分记录">
              <PointsHistoryButton type="default" onClick={showPointsHistory}>
                <ClockCircleOutlined />
                积分记录
              </PointsHistoryButton>
            </Tooltip>
            <Tooltip title="当前积分">
              <PointsButton type="default" onClick={handlePointsClick}>
                <TrophyOutlined />
                <PointsBadge 
                  count={user?.points || 0} 
                  overflowCount={99999}
                  title={user?.points || 0}
                />
              </PointsButton>
            </Tooltip>
            <UserInfo />
          </HeaderRight>
        </StyledHeader>
        <StyledContent>
          <ChatWindow
            selectedAssistant={selectedAssistant}
            collapsed={collapsed}
            updateUser={updateUser}
          />
        </StyledContent>

        <Modal
          title="微信客服"
          open={wechatModalVisible}
          onCancel={() => setWechatModalVisible(false)}
          footer={null}
          width={400}
          centered
        >
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <img 
              src="/images/wechat-qr.png" 
              alt="微信客服二维码"
              style={{ 
                width: '100%', 
                maxWidth: '300px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }} 
            />
            <p style={{ 
              marginTop: '16px',
              color: '#666',
              fontSize: '14px'
            }}>
              扫描二维码添加客服微信
            </p>
          </div>
        </Modal>
      </Layout>
    </StyledLayout>
  );
};

export default ChatLayout; 