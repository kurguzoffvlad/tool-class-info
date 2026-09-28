// inspectable-base.ts
export type LogSink = (message: string) => void;

export class ClassInfo {
  // Получение только публичных методов
  getPublicMethods(): string[] {
    const allMethods = this.getAllMethods();
    const privateFields = this.getPrivateFields();
    
    return allMethods.filter(method => 
      !privateFields.includes(method) &&
      !method.startsWith('#') // исключаем приватные поля с #
    );
  }

  // Получение только публичных свойств
  getPublicProperties(): string[] {
    const allProps = Object.getOwnPropertyNames(this)
      .filter(prop => typeof (this as any)[prop] !== 'function');
    
    const privateFields = this.getPrivateFields();
    
    return allProps.filter(prop =>
      !privateFields.includes(prop) &&
      !prop.startsWith('#')
    );
  }

  // Получение всех приватных полей (включая protected)
  private getPrivateFields(): string[] {
    const privateFields: string[] = [];
    let proto = Object.getPrototypeOf(this);
    
    // Собираем все поля из прототипа
    while (proto && proto !== Object.prototype) {
      const props = Object.getOwnPropertyNames(proto);
      props.forEach(prop => {
        // Проверяем, является ли поле приватным/защищённым
        if (this.isPrivateField(prop)) {
          privateFields.push(prop);
        }
      });
      proto = Object.getPrototypeOf(proto);
    }
    
    return privateFields;
  }

  // Определяем приватное/защищённое поле по конвенции
  private isPrivateField(fieldName: string): boolean {
    // Варианты обозначения приватных полей:
    // 1. Начинается с _ (конвенция)
    // 2. Начинается с # (ES2022 приватные поля)
    // 3. Начинается с __ (другая конвенция)
    return fieldName.startsWith('_') || 
           fieldName.startsWith('#') ||
           fieldName.startsWith('__');
  }

  // Получение всех методов (включая приватные)
  private getAllMethods(): string[] {
    const methods: string[] = [];
    let proto = Object.getPrototypeOf(this);
    
    while (proto && proto !== Object.prototype) {
      const props = Object.getOwnPropertyNames(proto);
      props.forEach(prop => {
        if (prop !== 'constructor' && 
            typeof (this as any)[prop] === 'function' &&
            !methods.includes(prop)) {
          methods.push(prop);
        }
      });
      proto = Object.getPrototypeOf(proto);
    }
    
    return methods;
  }

  // Основной метод для получения структуры
  getStructure(): {
    publicProperties: string[],
    publicMethods: string[],
    privateFields: string[] // для информации
  } {
    return {
      publicProperties: this.getPublicProperties(),
      publicMethods: this.getPublicMethods(),
      privateFields: this.getPrivateFields()
    };
  }

  // Вывод в консоль с чётким разделением
  logStructure(): void {
    const info = this.getStructure();
    console.log(`=== Публичная структура ${this.constructor.name} ===`);
    console.log('📦 Публичные свойства!!!:', info.publicProperties.length ? info.publicProperties : 'нет');
    console.log('🔧 Публичные методы:', info.publicMethods.length ? info.publicMethods : 'нет');
    console.log('🔒 Приватные поля (скрыты):', info.privateFields.length ? info.privateFields : 'нет');
  }

  // Получение только публичных свойств с их значениями
  getPublicState(): Record<string, any> {
    const result: Record<string, any> = {};
    const props = this.getPublicProperties();
    
    props.forEach(prop => {
      result[prop] = (this as any)[prop];
    });
    
    return result;
  }
}
