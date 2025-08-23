interface AlphabetFilterProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
}

export function AlphabetFilter({ currentFilter, onFilterChange }: AlphabetFilterProps) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const handleLetterClick = (letter: string) => {
    // Toggle functionality - if same letter is clicked, clear filter
    const newFilter = currentFilter.toLowerCase() === letter.toLowerCase() ? '' : letter.toLowerCase()
    onFilterChange(newFilter)
  }

  const handleAllClick = () => {
    onFilterChange('')
  }

  return (
    <div className="w-15 bg-accent-brand rounded-3xl flex flex-col items-center h-full max-h-[60vh]">
      {/* <div className="text-content-muted text-text-small mb-4">Filter</div> */}
      <div className="flex flex-col px-5 py-4 gap-1 flex-1 overflow-y-auto scrollbar-hide">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`w-8 h-8 p-1 text-text-large font-bold rounded hover:bg-background-secondary transition-all duration-300 ${
              currentFilter.toLowerCase() === letter.toLowerCase()
                ? 'bg-accent text-background-primary hover:text-content-primary my-2'
                : 'text-content-muted hover:text-content-primary my-0'
            }`}
          >
            <span className={`inline-block transition-transform ${
              currentFilter.toLowerCase() === letter.toLowerCase() ? 'scale-160' : ''
            }`}>
              {letter}
            </span>
          </button>
        ))}
        <button
          onClick={handleAllClick}
          className={`w-8 h-8 text-text-small rounded hover:bg-background-secondary transition-colors mt-2 ${
            currentFilter === ''
              ? 'bg-accent text-content-muted font-medium'
              : 'text-content-muted hover:text-content-primary'
          }`}
        >
          All
        </button>
      </div>
    </div>
  )
}