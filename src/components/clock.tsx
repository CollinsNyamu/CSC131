// Clock
export const Clock = () => {
  const [time, setTime] = useState(new Date().toTimeString());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  return(
    <Text>
      {time}
    </Text>
  );
};