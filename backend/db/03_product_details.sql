ALTER TABLE products ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS composition  TEXT         NOT NULL DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url    VARCHAR(500) NOT NULL DEFAULT '';

UPDATE products SET
    manufacturer = 'SportLab Nutrition (Україна)',
    composition  = 'Концентрат сироваткового білка (80%), какао-порошок, ароматизатор, підсолоджувач сукралоза. 24 г білка на порцію 30 г.',
    image_url    = '/images/products/protein.jpeg'
WHERE name = 'Whey Protein 1 кг';

UPDATE products SET
    manufacturer = 'SportLab Nutrition (Україна)',
    composition  = 'Ізолят сироваткового білка (90%), ароматизатор ваніль, емульгатор соєвий лецитин, сукралоза. 27 г білка на порцію 30 г.',
    image_url    = '/images/products/protein2.jpeg'
WHERE name = 'Whey Isolate 900 г';

UPDATE products SET
    manufacturer = 'PowerFuel (Польща)',
    composition  = 'Креатину моногідрат мікронізований 100%. 5 г на порцію.',
    image_url    = '/images/products/creatine.jpeg'
WHERE name = 'Creatine Monohydrate 300 г';

UPDATE products SET
    manufacturer = 'PowerFuel (Польща)',
    composition  = 'L-лейцин, L-ізолейцин, L-валін у співвідношенні 2:1:1, лимонна кислота, ароматизатор кавун, сукралоза.',
    image_url    = '/images/products/amino.jpeg'
WHERE name = 'BCAA 2:1:1 400 г';

UPDATE products SET
    manufacturer = 'MassPro (Україна)',
    composition  = 'Мальтодекстрин, концентрат сироваткового білка, декстроза, ароматизатор полуниця, вітамінний премікс. 60 г вуглеводів і 20 г білка на порцію.',
    image_url    = '/images/products/gainer.jpeg'
WHERE name = 'Gainer Mass 3 кг';

UPDATE products SET
    manufacturer = 'PowerFuel (Польща)',
    composition  = 'Бета-аланін, L-цитрулін малат, кофеїн (200 мг на порцію), таурин, лимонна кислота, ароматизатор цитрус.',
    image_url    = '/images/products/preworkout.jpeg'
WHERE name = 'Pre-Workout 300 г';

UPDATE products SET
    manufacturer = 'VitaLine (Німеччина)',
    composition  = 'Риб''ячий жир 1000 мг (ЕПК 180 мг, ДГК 120 мг), желатинова капсула, вітамін E.',
    image_url    = '/images/products/vitamins.jpeg'
WHERE name = 'Omega-3 120 капс.';

UPDATE products SET
    manufacturer = 'SportLab Nutrition (Україна)',
    composition  = 'Молочний білок, карамельний шар, молочний шоколад, підсолоджувач мальтит. 20 г білка в батончику.',
    image_url    = '/images/products/bar.jpg'
WHERE name = 'Protein Bar 60 г';
