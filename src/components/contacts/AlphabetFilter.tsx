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
    <div className="w-20 border-r border-background-secondary p-4">
      <div className="text-content-muted text-text-small mb-4">Filter</div>
      <div className="flex flex-col gap-1">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`w-8 h-8 text-text-small rounded hover:bg-background-secondary transition-colors ${
              currentFilter.toLowerCase() === letter.toLowerCase()
                ? 'bg-accent text-background-primary font-medium'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            {letter}
          </button>
        ))}
        <button
          onClick={handleAllClick}
          className={`w-8 h-8 text-text-small rounded hover:bg-background-secondary transition-colors mt-2 ${
            currentFilter === ''
              ? 'bg-accent text-background-primary font-medium'
              : 'text-content-muted hover:text-content-primary'
          }`}
        >
          All
        </button>
      </div>
    </div>
  )
}