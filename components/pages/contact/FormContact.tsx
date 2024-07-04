
export default function FormContact() {
  return (
    <>
      <h2>Contact</h2>
      <form className="flex flex-col min-w-[300px] border-2 border-slate-300 rounded-md p-6 gap-6">
        <div className="flex gap-3 justify-center items-center">
          <label className="w-1/3">Email : </label>
          <input type="email" placeholder="arcadia.zoo@yahoo.fr" className="w-2/3 p-2 rounded-md"/>
        </div>
        <div className="flex gap-3 justify-center items-center">
          <label className="w-1/3">Titre : </label>
          <input type="text" placeholder="Animaux sauvage..." className="w-2/3 p-2 rounded-md"/>
        </div>
        <div className="flex gap-3 justify-center items-center">
          <label className="w-1/3">Contact </label>
          <textarea placeholder="Insérez votre demande ici ..." className="w-2/3 p-2 rounded-md"/>
        </div>
        <button className="border-2 border-green-400 bg-green-200 hover:bg-green-300 text-green-700 self-center p-1 rounded-md">Envoyer</button>
      </form>
    </>
  )
}