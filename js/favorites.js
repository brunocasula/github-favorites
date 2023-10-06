export { Favorites, FavoritesView }

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    // this.entries = [
    //   {
    //     login: 'brunocasula',
    //     name: 'Bruno Casula',
    //     public_repos: '70',
    //     followers: '9589'
    //   },
    //   {
    //     login: 'maykbrito',
    //     name: 'Mayk Brito',
    //     public_repos: '76',
    //     followers: '120000'
    //   }
    // ]
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry =>
      entry.login !== user.login
    )

    this.entries = filteredEntries
    this.update()
  }
}


// classe que vai criar a visualização eeventos do HTML
class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    // console.log(this.root)
    this.update()
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

    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));

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