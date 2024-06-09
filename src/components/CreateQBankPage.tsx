export const CreateQBankPage = ({ setCurrentPage }) => {
    return (
        <div>
            <button onClick={() => setCurrentPage('userqb')}>Back</button>
            <h1>Create your own Question Bank</h1>
            <form>
                <label htmlFor='title'>Title</label>
                <input type='text' id='title' />
                <label htmlFor='description'>Description</label>
                <textarea id='description' />
                <button>Create</button>
            </form>
        </div>
    );
}
