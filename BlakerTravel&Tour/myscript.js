document.addEventListener('DOMContentLoaded', function() {
    var termsModal = document.getElementById('terms-modal');
    var acceptBtn = document.getElementById('accept-terms');
    var declineBtn = document.getElementById('decline-terms');
    var loginForm = document.getElementById('login-form');
    var signupForm = document.getElementById('signup-form');
    var loginBtns = Array.from(document.querySelectorAll('.login-btn'));
    var userRole = localStorage.getItem('blakerRole');
    var isLoggedIn = localStorage.getItem('blakerLoggedIn') === 'true';

    var updateLoginButtons = function() {
        if (!loginBtns || loginBtns.length === 0) return;

        loginBtns.forEach(function(loginBtn) {
            if (isLoggedIn) {
                loginBtn.textContent = 'Logout';
                loginBtn.href = 'index.html';
                loginBtn.dataset.logged = 'true';
            } else {
                loginBtn.textContent = 'Login';
                loginBtn.href = 'login.html';
                delete loginBtn.dataset.logged;
            }
        });
    };

    updateLoginButtons();

    loginBtns.forEach(function(loginBtn) {
        loginBtn.addEventListener('click', function(event) {
            if (isLoggedIn) {
                event.preventDefault();
                localStorage.removeItem('blakerLoggedIn');
                localStorage.removeItem('blakerRole');
                localStorage.removeItem('blakerUserName');
                isLoggedIn = false;
                userRole = null;
                updateLoginButtons();
                window.location.replace('index.html');
            }
        });
    });

    if (termsModal) {
        if (!isLoggedIn) {
            termsModal.style.display = 'flex';
        } else {
            termsModal.style.display = 'none';
        }
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            if (termsModal) {
                termsModal.style.display = 'none';
            }
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    var showAuthPanel = function(panel) {
        var loginPanel = document.getElementById('login');
        var signupPanel = document.getElementById('signup');
        if (!loginPanel || !signupPanel) return;

        if (panel === 'signup') {
            loginPanel.classList.add('hidden');
            signupPanel.classList.remove('hidden');
        } else {
            loginPanel.classList.remove('hidden');
            signupPanel.classList.add('hidden');
        }
    };

    var authLinks = document.querySelectorAll('.auth-switch a[data-auth-target]');
    authLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            var target = this.dataset.authTarget;
            if (target) {
                showAuthPanel(target);
                window.location.hash = target === 'signup' ? '#signup' : '#login';
            }
        });
    });

    var setLoggedIn = function(role, userName) {
        localStorage.setItem('blakerLoggedIn', 'true');
        localStorage.setItem('blakerRole', role);
        if (userName) {
            localStorage.setItem('blakerUserName', userName);
        }
        isLoggedIn = true;
        userRole = role;
        updateLoginButtons();
    };

    function getPendingBooking() {
        var pending = localStorage.getItem('blakerPendingBooking');
        if (!pending) return null;
        try {
            return JSON.parse(pending);
        } catch (e) {
            return null;
        }
    }

    var updatePanelFromHash = function() {
        if (window.location.hash === '#signup') {
            showAuthPanel('signup');
        } else {
            showAuthPanel('login');
        }
    };

    window.addEventListener('hashchange', updatePanelFromHash);
    updatePanelFromHash();

    if (loginForm) {
        var loginError = document.getElementById('login-error');
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            var username = document.getElementById('login-username').value.trim();
            var password = document.getElementById('login-password').value;

            if (username === 'User' && password === 'user123') {
                setLoggedIn('User', username);
                window.location.href = 'userdashboard.html';
            } else if (username === 'Admin' && password === 'admin123') {
                setLoggedIn('Admin', username);
                window.location.href = 'Admin.html';
            } else if (username === 'SuperA' && password === 'super123') {
                setLoggedIn('SuperA', username);
                window.location.href = 'SuperA.html';
            } else {
                if (loginError) {
                    loginError.textContent = 'Invalid username or password. Use User / user123, Admin / admin123, or SuperA / super123.';
                }
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            var signupFeedback = document.getElementById('signup-feedback');
            var fullName = document.getElementById('signup-fullname').value.trim();
            var email = document.getElementById('signup-email').value.trim();
            var phone = document.getElementById('signup-phone').value.trim();
            var age = document.getElementById('signup-age').value.trim();
            var password = document.getElementById('signup-password').value;
            var confirmPassword = document.getElementById('signup-confirm-password').value;

            if (!fullName || !email || !phone || !age || !password || !confirmPassword) {
                if (signupFeedback) {
                    signupFeedback.textContent = 'Please fill in every required signup field.';
                    signupFeedback.style.color = '#d14545';
                }
                return;
            }

            if (password !== confirmPassword) {
                if (signupFeedback) {
                    signupFeedback.textContent = 'Passwords do not match. Please try again.';
                    signupFeedback.style.color = '#d14545';
                }
                return;
            }

            if (signupFeedback) {
                signupFeedback.textContent = 'Signup complete! Please login with your new credentials.';
                signupFeedback.style.color = '#1f8d40';
            }
            signupForm.reset();
            showAuthPanel('login');
            window.location.hash = '#login';
        });
    }

    var paymentModal = document.getElementById('payment-modal');
    var paymentClose = document.getElementById('payment-close');
    var paymentOptions = document.querySelectorAll('.payment-option');
    var bookButtons = document.querySelectorAll('.book-btn');
    var paymentFormContainer = document.getElementById('payment-form-container');
    var selectedVanName = '';
    var currentPaymentMethod = null;
    var selectedPaymentMethod = null;

    function clearPaymentForm() {
        if (paymentFormContainer) {
            paymentFormContainer.innerHTML = '';
        }
        currentPaymentMethod = null;
        selectedPaymentMethod = null;
        // Reset payment option styles
        paymentOptions.forEach(function(option) {
            option.classList.remove('selected');
        });
    }

    function getSavedReviews() {
        var reviews = localStorage.getItem('blakerReviews');
        try {
            return reviews ? JSON.parse(reviews) : [];
        } catch (e) {
            return [];
        }
    }

    function saveReview(review) {
        var reviews = getSavedReviews();
        reviews.unshift(review);
        localStorage.setItem('blakerReviews', JSON.stringify(reviews));
    }

    function renderReviewList() {
        var reviewSection = document.getElementById('reviews-list');
        if (!reviewSection) return;

        var reviews = getSavedReviews();
        if (!reviews.length) {
            reviewSection.innerHTML = '<p class="empty-reviews">No customer reviews yet.</p>';
            return;
        }

        reviewSection.innerHTML = reviews.map(function(review) {
            var stars = '';
            for (var i = 1; i <= 5; i++) {
                stars += i <= review.rating ? '★' : '☆';
            }
            return '<div class="review-card">' +
                '<div class="review-card-header"><strong>' + (review.van || 'Booking') + '</strong><span>' + review.date + '</span></div>' +
                '<div class="review-rating">' + stars + '</div>' +
                '<p>' + review.comments + '</p>' +
                '</div>';
        }).join('');
    }

    function showRatingForm() {
        if (!paymentFormContainer) return;

        var ratingHtml = '<div class="payment-method-title">Rate Your Booking</div>' +
            '<form id="rating-form" class="payment-form">' +
            '<div class="rating-stars-row">' +
            '<button type="button" class="rating-star" data-value="1">★</button>' +
            '<button type="button" class="rating-star" data-value="2">★</button>' +
            '<button type="button" class="rating-star" data-value="3">★</button>' +
            '<button type="button" class="rating-star" data-value="4">★</button>' +
            '<button type="button" class="rating-star" data-value="5">★</button>' +
            '</div>' +
            '<label>Comments<textarea id="rating-comments" placeholder="Share your thoughts about the booking and payment experience"></textarea></label>' +
            '<button type="submit" class="payment-submit">Submit Review</button>' +
            '<p class="payment-feedback" id="rating-feedback"></p>' +
            '</form>';

        paymentFormContainer.innerHTML = ratingHtml;

        var selectedRating = { value: 0 };
        var ratingStars = Array.from(paymentFormContainer.querySelectorAll('.rating-star'));
        ratingStars.forEach(function(star) {
            star.addEventListener('click', function() {
                selectedRating.value = Number(this.dataset.value);
                ratingStars.forEach(function(s) {
                    s.classList.toggle('active', Number(s.dataset.value) <= selectedRating.value);
                });
            });
        });

        var ratingForm = document.getElementById('rating-form');
        if (ratingForm) {
            ratingForm.addEventListener('submit', function(event) {
                event.preventDefault();
                var feedback = document.getElementById('rating-feedback');
                var comments = document.getElementById('rating-comments').value.trim();

                if (!selectedRating.value) {
                    if (feedback) feedback.textContent = 'Please select a star rating.';
                    return;
                }

                if (!comments) {
                    if (feedback) feedback.textContent = 'Please leave a short comment.';
                    return;
                }

                saveReview({
                    van: selectedVanName || 'Van Booking',
                    method: currentPaymentMethod || 'Unknown',
                    rating: selectedRating.value,
                    comments: comments,
                    date: new Date().toLocaleDateString()
                });

                renderReviewList();
                alert('Thank you! Your review has been submitted.');
                clearPaymentForm();
                if (paymentModal) {
                    paymentModal.style.display = 'none';
                }
            });
        }
    }

    function showPaymentForm(method) {
        if (!paymentFormContainer) return;

        currentPaymentMethod = method;
        var formHtml = '';
        if (method === 'Card') {
            formHtml = '<div class="payment-method-title">Credit Card Payment</div>' +
                '<form id="payment-form" class="payment-form">' +
                '<label>Card Number<input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19"></label>' +
                '<label>Expiration Date<input type="text" id="card-expiration" placeholder="MM / YY"></label>' +
                '<label>Security Code<input type="text" id="card-cvv" placeholder="123" maxlength="4"></label>' +
                '<label>Card Holder Name<input type="text" id="card-holder" placeholder="Full card holder name"></label>' +
                '<button type="submit" class="payment-submit">Pay with Card</button>' +
                '<p class="payment-feedback" id="payment-feedback"></p>' +
                '</form>';
        } else if (method === 'GCash') {
            formHtml = '<div class="payment-method-title">GCash Payment</div>' +
                '<form id="payment-form" class="payment-form">' +
                '<label>Phone Number<input type="tel" id="gcash-phone" placeholder="09xx xxx xxxx"></label>' +
                '<label>Amount<input type="number" id="gcash-amount" placeholder="Amount to pay" min="1"></label>' +
                '<button type="submit" class="payment-submit">Confirm GCash</button>' +
                '<p class="payment-feedback" id="payment-feedback"></p>' +
                '</form>';
        } else if (method === 'Cash') {
            formHtml = '<div class="payment-method-title">Cash on Delivery</div>' +
                '<form id="payment-form" class="payment-form">' +
                '<label>Contact Name<input type="text" id="cash-name" placeholder="Your full name"></label>' +
                '<label>Phone Number<input type="tel" id="cash-phone" placeholder="09xx xxx xxxx"></label>' +
                '<label>Pickup Address<input type="text" id="cash-address" placeholder="Enter delivery or pickup address"></label>' +
                '<label>Expected Cash Amount<input type="number" id="cash-amount" placeholder="Amount to pay" min="1"></label>' +
                '<button type="submit" class="payment-submit">Confirm Cash on Delivery</button>' +
                '<p class="payment-feedback" id="payment-feedback"></p>' +
                '</form>';
        }

        paymentFormContainer.innerHTML = formHtml;

        var paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', function(event) {
                event.preventDefault();
                var feedback = document.getElementById('payment-feedback');
                if (!feedback) return;

                // Check if payment method is selected
                if (!selectedPaymentMethod) {
                    feedback.textContent = 'Please select a payment method first.';
                    return;
                }

                if (method === 'Card') {
                    var cardNumber = document.getElementById('card-number').value.trim();
                    var expiration = document.getElementById('card-expiration').value.trim();
                    var cvv = document.getElementById('card-cvv').value.trim();
                    var cardHolder = document.getElementById('card-holder').value.trim();

                    if (!cardNumber || !expiration || !cvv || !cardHolder) {
                        feedback.textContent = 'Please fill in all card fields to proceed.';
                        return;
                    }

                    feedback.textContent = '';
                    saveActiveRental({ vanName: selectedVanName || 'Van Booking', status: 'Currently Being Rented' });
                    renderActiveRental();
                    alert('Booking "' + selectedVanName + '" successful! Your card payment has been received.');
                } else if (method === 'GCash') {
                    var gcashPhone = document.getElementById('gcash-phone').value.trim();
                    var gcashAmount = document.getElementById('gcash-amount').value.trim();

                    if (!gcashPhone || !gcashAmount) {
                        feedback.textContent = 'Please enter your phone number and payment amount.';
                        return;
                    }

                    feedback.textContent = '';
                    saveActiveRental({ vanName: selectedVanName || 'Van Booking', status: 'Currently Being Rented' });
                    renderActiveRental();
                    alert('Booking "' + selectedVanName + '" successful! GCash payment confirmed.');
                } else if (method === 'Cash') {
                    var cashName = document.getElementById('cash-name').value.trim();
                    var cashPhone = document.getElementById('cash-phone').value.trim();
                    var cashAddress = document.getElementById('cash-address').value.trim();
                    var cashAmount = document.getElementById('cash-amount').value.trim();

                    if (!cashName || !cashPhone || !cashAddress || !cashAmount) {
                        feedback.textContent = 'Please fill in all cash-on-delivery details before continuing.';
                        return;
                    }

                    feedback.textContent = '';
                    saveActiveRental({ vanName: selectedVanName || 'Van Booking', status: 'Currently Being Rented' });
                    renderActiveRental();
                    alert('Booking "' + selectedVanName + '" successful! Cash on delivery is ready for processing.');
                }

                showRatingForm();
            });
        }
    }

    if (paymentModal && (window.location.pathname.includes('Vanrental.html') || window.location.pathname.includes('userdashboard.html'))) {
        bookButtons.forEach(function(button) {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                if (!isLoggedIn) {
                    alert('Please log in to continue with your booking.');
                    window.location.href = 'login.html';
                    return;
                }
                var vanItem = this.closest('.van-item');
                if (vanItem) {
                    var vanName = vanItem.querySelector('h3');
                    selectedVanName = vanName ? vanName.textContent : 'van';
                }
                clearPaymentForm();
                paymentModal.style.display = 'flex';
            });
        });
    }

    if (paymentClose) {
        paymentClose.addEventListener('click', function() {
            if (paymentModal) {
                paymentModal.style.display = 'none';
            }
            clearPaymentForm();
        });
    }

    var activeRentalNotification = document.getElementById('rental-action-notification');
    var rentalNotificationMessage = document.getElementById('rental-notification-message');
    var rentalNotificationClose = document.getElementById('rental-notification-close');
    var statusText = document.querySelector('.status-text');
    var returnDateValue = document.getElementById('return-date-value');
    var durationValue = document.getElementById('duration-value');
    var doneRentingBtn = document.querySelector('.done-renting-btn');
    var extendRentalBtn = document.querySelector('.extend-rental-btn');
    var pickupDateValue = document.getElementById('pickup-date-value');
    var activeRentalSection = document.querySelector('.currently-rented');
    var activeRentalVanName = document.getElementById('active-rental-van-name');

    if (rentalNotificationClose) {
        rentalNotificationClose.addEventListener('click', hideRentalNotification);
    }

    function hideRentalNotification() {
        if (!activeRentalNotification) return;
        activeRentalNotification.classList.add('hidden');
        activeRentalNotification.classList.remove('success', 'info', 'warning');
        if (rentalNotificationMessage) {
            rentalNotificationMessage.textContent = '';
        }
    }

    function showRentalNotification(message, type) {
        if (!activeRentalNotification || !rentalNotificationMessage) {
            alert(message);
            return;
        }
        rentalNotificationMessage.textContent = message;
        activeRentalNotification.classList.remove('hidden');
        activeRentalNotification.classList.remove('success', 'info', 'warning');
        activeRentalNotification.classList.add(type || 'info');
    }

    function parseDateFromText(text) {
        var date = new Date(text);
        return isNaN(date.getTime()) ? null : date;
    }

    function formatRentalDate(date) {
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    function getActiveRental() {
        var storedRental = localStorage.getItem('blakerActiveRental');
        if (!storedRental) return null;
        try {
            return JSON.parse(storedRental);
        } catch (e) {
            return null;
        }
    }

    function saveActiveRental(data) {
        if (!data || typeof data !== 'object') return;
        var existingRental = getActiveRental() || {};
        var rentalToSave = Object.assign({}, existingRental, data);
        localStorage.setItem('blakerActiveRental', JSON.stringify(rentalToSave));
    }

    function renderActiveRental() {
        var activeRental = getActiveRental();
        var activeRentalCard = document.querySelector('.active-rental-card');

        if (!activeRental || !activeRentalSection || !activeRentalCard) {
            if (activeRentalSection) {
                activeRentalSection.classList.add('hidden');
            }
            return;
        }

        activeRentalSection.classList.remove('hidden');

        if (activeRentalVanName && activeRental.vanName) {
            activeRentalVanName.textContent = activeRental.vanName;
        }

        if (pickupDateValue && activeRental.pickupDatetime) {
            var pickupDate = parseDateFromText(activeRental.pickupDatetime);
            if (pickupDate) pickupDateValue.textContent = formatRentalDate(pickupDate);
        }

        if (returnDateValue && activeRental.returnDatetime) {
            var returnDate = parseDateFromText(activeRental.returnDatetime);
            if (returnDate) returnDateValue.textContent = formatRentalDate(returnDate);
        }

        if (durationValue && pickupDateValue && returnDateValue) {
            updateDuration();
        }

        if (statusText && activeRental.status) {
            statusText.textContent = activeRental.status;
        }

        if (activeRentalNotification) {
            hideRentalNotification();
        }

        if (doneRentingBtn) doneRentingBtn.disabled = false;
        if (extendRentalBtn) extendRentalBtn.disabled = false;
    }

    renderActiveRental();

    function updateDuration() {
        if (!pickupDateValue || !returnDateValue || !durationValue) return;
        var start = parseDateFromText(pickupDateValue.textContent.trim());
        var end = parseDateFromText(returnDateValue.textContent.trim());
        if (!start || !end) return;
        var diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
        durationValue.textContent = diff === 1 ? '1 Day' : diff + ' Days';
    }

    if (doneRentingBtn) {
        doneRentingBtn.addEventListener('click', function() {
            if (statusText) {
                statusText.textContent = 'Return Confirmed';
            }
            saveActiveRental({ status: 'Return Confirmed' });
            var vanName = activeRentalVanName ? activeRentalVanName.textContent : 'your van';
            var returnDateText = returnDateValue ? returnDateValue.textContent : '';
            var message = 'Return confirmed for ' + vanName + '. Thank you for returning it safely.';
            if (returnDateText) {
                message += ' Original return date: ' + returnDateText + '.';
            }
            showRentalNotification(message, 'success');
            if (doneRentingBtn) doneRentingBtn.disabled = true;
            if (extendRentalBtn) extendRentalBtn.disabled = true;
        });
    }

    if (extendRentalBtn) {
        extendRentalBtn.addEventListener('click', function() {
            var extraDays = prompt('How many extra days would you like to extend the rental?', '1');
            if (!extraDays) return;
            extraDays = parseInt(extraDays, 10);
            if (isNaN(extraDays) || extraDays < 1) {
                alert('Please enter a valid number of days.');
                return;
            }

            if (returnDateValue) {
                var currentReturn = parseDateFromText(returnDateValue.textContent.trim());
                if (currentReturn) {
                    currentReturn.setDate(currentReturn.getDate() + extraDays);
                    returnDateValue.textContent = formatRentalDate(currentReturn);
                    saveActiveRental({ returnDatetime: currentReturn.toISOString(), status: 'Extended Rental' });
                    if (statusText) {
                        statusText.textContent = 'Extended Rental';
                    }
                }
            }
            updateDuration();
            showRentalNotification('Rental extended by ' + extraDays + ' day' + (extraDays === 1 ? '' : 's') + '. New return date: ' + returnDateValue.textContent + '.', 'info');
        });
    }

    paymentOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            var method = this.dataset.method;

            // Remove selected class from all options
            paymentOptions.forEach(function(opt) {
                opt.classList.remove('selected');
            });

            // Add selected class to clicked option
            this.classList.add('selected');

            // Store selected payment method
            selectedPaymentMethod = method;

            // Show payment form for selected method
            showPaymentForm(method);
        });
    });

    var showCreateStaffButton = document.getElementById('show-create-staff');
    var showRemoveStaffButton = document.getElementById('show-remove-staff');
    var createStaffPanel = document.getElementById('create-staff-panel');
    var removeStaffPanel = document.getElementById('remove-staff-panel');
    var createStaffForm = document.getElementById('create-staff-form');
    var staffList = document.getElementById('staff-list');

    function hideStaffPanels() {
        if (createStaffPanel) createStaffPanel.classList.add('hidden');
        if (removeStaffPanel) removeStaffPanel.classList.add('hidden');
    }

    if (showCreateStaffButton) {
        showCreateStaffButton.addEventListener('click', function() {
            hideStaffPanels();
            if (createStaffPanel) createStaffPanel.classList.toggle('hidden');
        });
    }

    if (showRemoveStaffButton) {
        showRemoveStaffButton.addEventListener('click', function() {
            hideStaffPanels();
            if (removeStaffPanel) removeStaffPanel.classList.toggle('hidden');
        });
    }

    if (createStaffForm) {
        createStaffForm.addEventListener('submit', function(event) {
            event.preventDefault();
            var name = document.getElementById('staff-name').value.trim();
            var username = document.getElementById('staff-username').value.trim();
            var password = document.getElementById('staff-password').value;
            var confirmPassword = document.getElementById('staff-confirm-password').value;
            var feedback = document.getElementById('create-staff-feedback');

            if (!name || !username || !password || !confirmPassword) {
                if (feedback) feedback.textContent = 'Please fill in every field.';
                return;
            }
            if (password !== confirmPassword) {
                if (feedback) feedback.textContent = 'Passwords do not match.';
                return;
            }

            if (feedback) feedback.textContent = '';
            alert('Staff account for "' + name + '" has been created.');
            createStaffForm.reset();

            if (staffList) {
                var item = document.createElement('div');
                item.className = 'staff-item';
                item.innerHTML = '<div><strong>' + name + '</strong><p>Username: ' + username + '</p></div>' +
                    '<button type="button" class="staff-remove">Remove</button>';
                staffList.appendChild(item);
                var removeButton = item.querySelector('.staff-remove');
                if (removeButton) {
                    removeButton.addEventListener('click', function() {
                        item.remove();
                    });
                }
            }
        });
    }

    function attachRemoveHandlers() {
        if (!staffList) return;
        var removeButtons = staffList.querySelectorAll('.staff-remove');
        removeButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var item = this.closest('.staff-item');
                if (item) {
                    item.remove();
                }
            });
        });
    }

    attachRemoveHandlers();
    renderReviewList();
});
