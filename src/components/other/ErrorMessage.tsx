const ErrorMessage: React.FC<{ id: string, children: string }> = ({ id, children }) => {
  if (!children) return null;

  return (
    <div 
        style={{
            color: 'red',
            padding: '4px 2px',
        }}
        id={id}
    >
      {children}
    </div>
  );
};

export default ErrorMessage;
