import React, { useState } from 'react';

interface IndexComponentProps {
    count: number;
}

const IndexComponent: React.FC<IndexComponentProps> = ({ count }) => {
    // 使用 useState 钩子来管理组件内部的 count 状态
    const [curr, setCount] = useState(count);

    // 定义一个函数来处理点击事件并更新 count
    const handleIncrement = () => {
        setCount(prevCount => prevCount + 1);
    };

    const divStyle = {
        padding: '22px 24px',
        boxShadow: '0 3px 12px rgba(0, 0, 0, .07), 0 1px 4px rgba(0, 0, 0, .07)',
        transition: 'background-color .5s ease'
    };

    const buttonStyle = {
        backgroundColor: '#f1f1f1',
        transition: 'background-color .5s',
        padding: '5px 12px',
        border: '1px solid rgba(60, 60, 60, .29)',
        borderRadius: '8px',
        fontSize: '.9em',
        fontWeight: 600,
        cursor: 'pointer',

        height: '36px'
    };

    return (
        <div style={divStyle} className="demo">
            <button style={buttonStyle} onClick={handleIncrement}>
                React Remote Count is: {curr}
            </button>
        </div>
    );
};

export default IndexComponent;
