class CreateLineFoods < ActiveRecord::Migration[7.1]
  def change
    create_table :line_foods do |t|
      t.references :food, null: false, foreign_key: true, comment: 'フードの名前'
      t.references :restaurant, null: false, foreign_key: true,comment: 'レストランの名前'
      t.references :order, foreign_key: true, comment: '注文ID'
      t.integer :count, null: false, default: 0, comment: '商品の数量'
      t.boolean :active, null: false, default: false, comment: '論理削除できるようにする'

      t.timestamps
    end
  end
end
