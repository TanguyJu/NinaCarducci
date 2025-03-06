document.addEventListener("DOMContentLoaded", function () {
    class Gallery {
        constructor(selector, options) {
            this.gallery = document.querySelector(selector);
            this.options = Object.assign({
                columns: 3,
                lightBox: true,
                lightboxId: "myAwesomeLightbox",
                showTags: true,
                tagsPosition: "top",
            }, options);
            this.tagsCollection = [];
            this.currentImageIndex = 0;
            this.images = [];
            this.init();
        }

        init() {
            this.createRowWrapper();
            if (this.options.lightBox) {
                this.createLightBox();
            }
            this.setupItems();
            if (this.options.showTags) {
                this.showItemTags();
            }
            this.gallery.style.display = "block";
        }

        createRowWrapper() {
            const row = document.createElement("div");
            row.classList.add("gallery-items-row", "row");
            this.gallery.appendChild(row);
        }

        setupItems() {
            this.images = Array.from(this.gallery.querySelectorAll(".gallery-item"));
            this.images.forEach((item, index) => {
                this.wrapItemInColumn(item);
                this.moveItemInRowWrapper(item);
                if (item.tagName === "IMG") {
                    item.classList.add("img-fluid");
                    item.dataset.index = index;
                    item.addEventListener("click", () => this.openLightBox(index));
                }
                let tag = item.dataset.galleryTag;
                if (this.options.showTags && tag && !this.tagsCollection.includes(tag)) {
                    this.tagsCollection.push(tag);
                }
            });
        }

        wrapItemInColumn(item) {
            const column = document.createElement("div");
            column.className = `item-column mb-4 col-${Math.ceil(12 / this.options.columns)}`;
            item.parentNode.insertBefore(column, item);
            column.appendChild(item);
        }

        moveItemInRowWrapper(item) {
            const row = this.gallery.querySelector(".gallery-items-row");
            row.appendChild(item.closest(".item-column"));
        }

        createLightBox() {
            const lightbox = document.createElement("div");
            lightbox.id = this.options.lightboxId;
            lightbox.classList.add("modal", "fade");
            lightbox.setAttribute("tabindex", "-1");
            lightbox.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body position-relative">
                            <div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:0;transform:translateY(-50%);background:white;padding:10px 15px;font-size:1.5rem;">❮</div>
                            <img class="lightboxImage img-fluid" alt="">
                            <div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:0;transform:translateY(-50%);background:white;padding:10px 15px;font-size:1.5rem;">❯</div>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(lightbox);
            lightbox.querySelector(".mg-prev").addEventListener("click", () => this.changeImage(-1));
            lightbox.querySelector(".mg-next").addEventListener("click", () => this.changeImage(1));
        }

        openLightBox(index) {
            this.currentImageIndex = index;
            this.updateLightboxImage();
            const lightbox = document.querySelector(`#${this.options.lightboxId}`);
            if (lightbox) {
                const modal = new bootstrap.Modal(lightbox);
                modal.show();
            }
        }

        updateLightboxImage() {
            const lightboxImage = document.querySelector(`#${this.options.lightboxId} .lightboxImage`);
            if (lightboxImage) {
                lightboxImage.src = this.images[this.currentImageIndex].src;
            }
        }

        changeImage(direction) {
            this.currentImageIndex = (this.currentImageIndex + direction + this.images.length) % this.images.length;
            this.updateLightboxImage();
        }

        showItemTags() {
            const tagContainer = document.createElement("ul");
            tagContainer.classList.add("tags-bar", "nav", "nav-pills");
            tagContainer.innerHTML = `<li class="nav-item"><span class="nav-link active" data-toggle="all">Tous</span></li>` +
                this.tagsCollection.map(tag => `<li class="nav-item"><span class="nav-link" data-toggle="${tag}">${tag}</span></li>`).join("");
            this.gallery.insertAdjacentElement(this.options.tagsPosition === "top" ? "beforebegin" : "afterend", tagContainer);
            tagContainer.addEventListener("click", event => this.filterByTag(event));
        }

        filterByTag(event) {
            if (!event.target.classList.contains("nav-link")) return;
            document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
            event.target.classList.add("active");
            let tag = event.target.dataset.toggle;
            document.querySelectorAll(".gallery-item").forEach(item => {
                let column = item.closest(".item-column");
                column.style.display = (tag === "all" || item.dataset.galleryTag === tag) ? "block" : "none";
            });
        }
    }

    new Gallery(".gallery", {
        columns: 3,
        lightBox: true,
        lightboxId: "myAwesomeLightbox",
        showTags: true,
        tagsPosition: "top",
    });
});
