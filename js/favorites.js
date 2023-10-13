export { Favorites, FavoritesView }

import { githubUser } from "./githubUser.js"

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login.toLowerCase() === username.toLowerCase())

      if (userExists) {
        throw new Error('Usuário já cadastrado!')
      }

      const user = await githubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save();

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry =>
      entry.login !== user.login
    )

    this.entries = filteredEntries
    this.update()
    this.save();
  }
}


// classe que vai criar a visualização eeventos do HTML
class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    // console.log(this.root)
    this.update()
    this.onadd()
  }

  onadd() {

    const addButton = this.root.querySelector('.search button');

    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input');

      this.add(value)
    }

    this.root.querySelector('.search input').addEventListener('keypress', (event) => {

      if (event.key === 'Enter') {
        const { value } = this.root.querySelector('.search input');

        this.add(value)
      }

    })
  }

  update() {
    this.removeAlltr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user a p').textContent = user.name
      row.querySelector('.user a span').textContent = user.login

      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOK = confirm('Tem certeza que deseja deletar essa linha?')

        if (isOK) {
          this.delete(user)
        }
      }
      this.tbody.append(row)
    })

  }

  createRow() {
    const tr = document.createElement('tr');

    tr.innerHTML =
      `
        <tr>
          <td class="user">
            <img src="https://github.com/brunocasula.png" alt="Imagem de brunocasula">
              <a href="https://github.com/brunocasula" target="_blank">
                <p>Bruno Casula</p>
                <span>brunocasula</span>
              </a>
          </td>
          <td class="repositories">
            76
          </td>
          <td class="followers">
            9589
          </td>
          <td>
            <button class="remove">&times;</button>
          </td>
        </tr>
      `
    return tr
  }


  removeAlltr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })
  }


}