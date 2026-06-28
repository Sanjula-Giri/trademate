from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape


BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = BASE_DIR / "templates"
INVOICE_DIR = BASE_DIR / "static" / "invoices"

env = Environment(loader=FileSystemLoader(TEMPLATES_DIR), autoescape=select_autoescape(["html", "xml"]))


def generate_invoice_pdf(invoice_data: dict) -> str:
    from weasyprint import HTML
    INVOICE_DIR.mkdir(parents=True, exist_ok=True)
    output_path = INVOICE_DIR / f"INV-{invoice_data['invoice_id']:03}.pdf"
    html_content = env.get_template("invoice.html").render(**invoice_data)
   

    HTML(string=html_content, base_url=str(BASE_DIR)).write_pdf(output_path) 
    return f"/static/invoices/{output_path.name}"
