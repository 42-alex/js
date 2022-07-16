export class SearchBox extends HTMLElement {
	constructor() {
		super();  // Вызов конструктора суперкласса;  обязан быть первым.

		// Создать теневое дерево D0M и прикрепить его к этому элементу,
		// устанавливая значение свойства this.shadowRoot.
		this.attachShadow({ mode: 'open' });

		// Клонировать шаблон,  который определяет потомков и таблицу стилей
		// для этого специального элемента,  и добавить такое содержимое
		// к  корневому элементу теневого дерева.
		this.shadowRoot.append(SearchBox.template.content.cloneNode(true));

		// Получить ссылки на важные элементы в теневой модели D0M.
		this.input = this.shadowRoot.querySelector('#input');
		let leftSlot = this.shadowRoot.querySelector('slot[name="left"]');
		let rightSlot = this.shadowRoot.querySelector('slot[name="right"]');

		// Когда внутреннее поле ввода получает или теряет фокус,  установить
		// или удалить атрибут "focused",  что заставит нашу внутреннюю таблицу
		// стилей отобразить или скрыть поддельное фокальное кольцо для целого
		// компонента.  Обратите внимание,  что события "blur" и "focus" совершают
		// пузырьковый подъем и выглядят происходящими в элементе <search-box>.
		this.input.onfocus = () => { this.setAttribute('focused', '') };
		this.input.onblur = () => { this.removeAttribute('focused') };

		// Если пользователь щелкает на увеличительном стекле,  тогда генерируется
		// событие "search". Оно также инициируется,  если поле ввода генерирует
		// событие "change".  (Событие "change" не поднимается пузырьком
		// за пределы теневой модели D0M.)
		leftSlot.onclick = this.input.onchange = (event) => {
			event.stopPropagation();   //Предотвратить подъем пузырьком событий щелчка
			if (this.disabled) return;  //Ничего не делать,  когда элемент отключен.
			this.dispatchEvent(new CustomEvent('search', {
				detail: this.input.value
			}))
		}

		// Если пользователь щелкает на X,  тогда генерируется событие "clear".
		// Если метод preventDefault()  не вызывался для события,  очистить ввод.
		rightSlot.onclick = (event) => {
			event.stopPropagation();   //He позволять событию щелчка подниматься
			if (this.disabled) return;  // Ничего не делать, когда элемент отключен
			let e = new CustomEvent('clear', { cancelable: true });
			this.dispatchEvent(e);
			if (!e.defaultPrevented) {  // Если событие не было "отменено",
				this.input.value = '';   // тогда очистить поле ввода.
			}
		}
	}

	// Когда некоторые из наших атрибутов устанавливаются или изменяются,
	// мы должны установить соответствующее значение во внутреннем элементе
	// <input>. Об этом позаботится данный метод жизненного цикла вместе
	// с  определенным ниже статическим свойством observedAttributes.
	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'disabled') {
			this.input.disabled = newValue !== null;
		}
		if (name === 'placeholder') {
			this.input.placeholder = newValue;
		}
		if (name === 'size') {
			this.input.size = newValue;
		}
		if (name === 'value') {
			this.input.value = newValue;
		}
	}

	// В заключение мы определяем методы получения и установки для свойств,
	// которые соответствуют поддерживаемым нами HTML-атрибутам. Методы получения
	// просто возвращают значение  (или наличие)  атрибута,  а методы установки
	// всего лишь устанавливают значение  (или наличие)  атрибута.  Когда метод
	// установки изменяет атрибут,  браузер автоматически вызовет определенный
	// выше attributeChangedCallback().
	get placeholder() { return this.getAttribute('placeholder') }
	get size() { return this.getAttribute('size') }
	get value() { return this.getAttribute('value') }
	get disabled() { return this.getAttribute('disabled') }
	get hidden() { return this.getAttribute('hidden') }

	set placeholder(newValue) { return this.setAttribute('placeholder', newValue) }
	set size(newValue) { return this.setAttribute('size', newValue) }
	set value(newValue) { return this.setAttribute('value', newValue) }
	set disabled(newValue) {
		if (newValue) this.setAttribute('disabled', '');
		else this.removeAttribute('disabled')
	}
	set hidden(newValue) {
		if (newValue) this.setAttribute('hidden', '');
		else this.removeAttribute('hidden')
	}
}

// Это статическое поле требуется для метода attributeChangedCallback() .
// Инициировать вызовы данного метода будут только атрибуты,
// имена которых указаны в этом массиве.
SearchBox.observedAttributes = ['placeholder', 'size', 'value', 'disabled'];

// Создать элемент <template> для хранения таблицы стилей и дерева элементов
// которые мы будем использовать для каждого экземпляра элемента SearchBox.
SearchBox.template = document.createElement('template');

// Мы инициализируем шаблон,  синтаксически анализируя эту строку HTML-разметки.
// Однако обратите внимание,  что когда мы создаем экземпляр SearchBox,
// то можем просто клонировать узлы в шаблоне и нам придется снова проводить
// синтаксический анализ HTML-разметки.
SearchBox.template.innerHTML = `
	<style>
		/* 
		 * Селектор :host ссылается на элемент <search-box> в световой модели DOM.
		 * эти стили применяются по умолчанию и могут быть переопределены
		 * пользователем элемента <search-box> стилями в световой модели DOM.
		 */
		:host {
			display: inline-block;  /* Встроенное отображение по умолчанию.  */
			border: solid black 1px;  /* Рамка со скругленными углами вокруг <input> */
			border-radius:  5px;		  /*  и <slot>.  */
			padding:  4px 6px;  /* Некоторое пространство внутри границы.  */
		}

		:host([hidden]) {  /* Обратите внимание на круглые скобки:  когда ведущий элемент скрыт...  */
			display: none;  /*  ...набор атрибутов не отображает его.  */
		}

		:host([disabled]) {  /* Когда ведущий элемент имеет атрибут disabled__*/
			opacity: 0.5;			/*  ...сделать его полупрозрачным.  */
		}

		:host([focused]) {  /*Когда ведущий элемент имеет атрибут focused__*/
			box-shadow: 0 0 2px 2px #6AE;   /*.. .отобразить это фиктивное фокальное кольцо*/
		}

		/* Остаток таблицы стилей применяется только к элементам в теневой модели DOM.*/ 
		input {
			border-width:  0;  /* Скрыть границу внутреннего поля ввода.  */
			outline: none;  /* Также скрыть фокальное кольцо.  */
			font: inherit;  /*По умолчанию элементы <input> не наследуют шрифт*/
			background:  inherit;  /* То же относился к цвету фона.  */
		}

		slot {
			cursor: pointer;  /* Указатель в форме указателя руки над кнопками.  */
			user-select: none;  /* Не разрешать пользователю выбирать текст эмотикона.  */
		}
	</style>


	<div>
		<slot name="left">\u{1f50d}</slot>  <!—-  U+1F50D - эмотикон c увеличительным стеклом —->
		<input type="text" id="input" />		<!—-  Фактический элемент ввода —-> 
		<slot name="right">\u{2573}</slot>	<!—-  U+2573 - эмотикон с X —->
	</div>
`;

// Наконец, мы вызываем customElement.defineO  для регистрации
// элемента SearchBox в качестве реализации дескриптора <search-box>.
// Специальные элементы должны иметь имя дескриптора,  которое содержит дефисы.
customElements.define("search-box",  SearchBox);  // эта строка должна быть в правильном месте; в коде, который будет импортировать модуль
