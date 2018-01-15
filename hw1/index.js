function getQuotes (callback) {
  var url = 'https://raw.githubusercontent.com/4skinSkywalker/Database-Quotes-JSON/master/quotes.json'
  var xhr = new window.XMLHttpRequest()

  xhr.addEventListener('readystatechange', function (event) {
    if (this.readyState !== 4) {
      return
    }

    if (this.status !== 200) {
      callback(new Error('Ошибка получения списка цитат: HTTP статус ' + this.status))
      return
    }

    var result
    try {
      result = JSON.parse(this.response)
    } catch (err) {
      callback(err)
      return
    }

    callback(null, result)
  }, false)

  xhr.open('GET', url, true)
  xhr.send()
}

function getQuotesCallback (err, quotes) {
  if (err) {
    throw err
  }

  var container = document.getElementById('container')
  var button = document.getElementById('change-quote-button')
  var quoteText = document.getElementById('quote-text')
  var quoteAuthor = document.getElementById('quote-author')

  var authors = []
  var author

  for (var i = 0; i < quotes.length; i++) {
    var quote = quotes[i]
    author = quote.quoteAuthor
    if (authors.indexOf(author) === -1) {
      authors.push(author)
    }
  }

  var select = document.createElement('select')
  var defaultOption = document.createElement('option')
  defaultOption.value = 'no-author'
  defaultOption.disabled = true
  defaultOption.innerText = '✅ Выберите автора цитаты:'

  select.appendChild(defaultOption)
  container.appendChild(select)

  for (var j = 0; j < authors.length; j++) {
    author = authors[j]
    if (typeof author !== 'string' || !author.length) {
      continue
    }

    var option = document.createElement('option')
    option.value = author
    option.innerText = author
    select.appendChild(option)
  }

  button.addEventListener('click', function (event) {
    event.preventDefault()
    var selectedOption = select.value
    var currentQuoteText = quoteText.innerText

    var sourceQuotes = selectedOption === 'no-author'
      ? quotes
      : quotes.filter(function (quote) {
        return quote.quoteAuthor === selectedOption && quote.quoteText !== currentQuoteText
      })

    if (!sourceQuotes.length) {
      return
    }

    var randomIndex = Math.floor(Math.random() * sourceQuotes.length)
    var quote = sourceQuotes[randomIndex]

    quoteText.innerText = quote.quoteText
    quoteAuthor.innerText = quote.quoteAuthor
  })
}

function main () {
  getQuotes(getQuotesCallback)
}

document.addEventListener('DOMContentLoaded', main, false)
