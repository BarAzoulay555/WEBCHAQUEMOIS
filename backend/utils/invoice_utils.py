def get_product_price(product_id, conn):
    cursor = conn.cursor()
    cursor.execute("SELECT price FROM products WHERE id = ?", (product_id,))
    result = cursor.fetchone()
    return result['price'] if result else 0


def create_invoice_if_not_exists(order, conn):
    cursor = conn.cursor()

    cursor.execute("SELECT 1 FROM invoices WHERE order_id = ?", (order['id'],))
    exists = cursor.fetchone()

    if not exists:
        price_per_unit = get_product_price(order['product_id'], conn)
        total_price = price_per_unit * order['quantity']
        cursor.execute("""
            INSERT INTO invoices (
                order_id, product_name, supplier_name, quantity,
                price_per_unit, total_price, issued_at, urgent, note, recipient
            )
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, 'CHAQUEMOIS')
        """, (
            order['id'],
            order['product_name'],
            order['supplier_name'],
            order['quantity'],
            price_per_unit,
            total_price,
            order.get('urgent', False),
            order.get('note')
        ))
        conn.commit()
