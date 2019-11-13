import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from configuration.db import get_db

bp = Blueprint('config', __name__, url_prefix='/config')


@bp.route('/setting', methods=('GET', 'POST'))
def setting():
    if request.method == 'POST':
        config_id = request.form['config_id']
        db = get_db()
        error = None

        if not config_id:
            error = 'Username is required.'
        elif db.execute(
            'SELECT config_id FROM configuration WHERE config_id = ?', (config_id,)
        ).fetchone() is not None:
            error = 'User {} is already registered.'.format(config_id)

        if error is None:
            # set new configuration
            db.execute(
                'INSERT INTO configuration (config_id) VALUES (?)',
                config_id
            )
            db.commit()
            return redirect(url_for('hello'))

        flash(error)

    return render_template('config/setting.html')
