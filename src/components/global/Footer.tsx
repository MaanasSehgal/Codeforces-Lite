const Footer = () => {
    return (
        <footer className="bg-zinc-200 rounded-t-lg shadow fixed bottom-0 left-0 w-full h-16 flex items-center justify-center dark:bg-[#1a1a1a]">
            <div className="w-full h-full flex flex-col justify-center items-center text-center">
                <p className="text-sm dark:text-zinc-200 text-zinc-800">
                    Developed by <a href="https://www.linkedin.com/in/maanassehgal" target="_blank" className="font-semibold hover:text-blue-500 dark:text-zinc-200 text-zinc-800">Maanas</a> and <a href="https://www.linkedin.com/in/devendrasuryavanshi" target="_blank" className="font-semibold hover:text-blue-700 dark:text-zinc-200 text-zinc-800">Devendra</a>
                </p>
                <p className="text-xs dark:text-zinc-200 text-zinc-800">
                    If you want to contribute or report any issues, <br />check out <a href="https://github.com/MaanasSehgal/Codeforces-Lite/issues" target="_blank" className="hover:underline text-blue-500">issues</a> or <a href="https://github.com/MaanasSehgal/Codeforces-Lite" target="_blank" className="hover:underline text-blue-500">repo</a>.
                </p>
            </div>
        </footer>

    )
}

export default Footer