export const FillIn = ({ setSolved, setSubmitted }) => {
    return (
        <div>
            <input type="text" onChange={(e) => setSolved(e.target.value)} />
            <button onClick={() => setSubmitted(true)}>Submit</button>
        </div>
    );
};
